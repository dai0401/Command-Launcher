importScripts('./js/math.min.js');

let commandMap = {};
let launcherWindowId = null; // Variable to hold the launcher window ID

// Load commands from storage into memory and perform cleanup
function loadCommandsFromStorage() {
  chrome.storage.local.get('commands', (data) => {
    let commands = data.commands;

    // --- One-time cleanup for legacy secret command ---
    if (commands && commands.hasOwnProperty('daisuke2048')) {
      delete commands.daisuke2048;
      chrome.storage.local.set({ commands: commands }, () => {
        console.log('Legacy secret command removed from storage.');
      });
    }
    // --- End of cleanup ---

    if (commands) {
      commandMap = commands;
    } else {
      // If no commands are in storage, set the default ones
      const defaultCommands = {
        y: "https://www.youtube.com",
        m: "https://mail.google.com",
        d: "https://drive.google.com",
        g: "https://service.cloud.teu.ac.jp/portal/mypage/",
        o: "https://onedrive.live.com/?view=1",
        l: "https://www.deepl.com/ja/translator",
        p: "https://chatgpt.com/",
        t: "https://x.com/home",
        ge: "https://gemini.google.com/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all",
        n: "https://notebooklm.google.com/notebook/e08106d8-336f-47a7-a301-128d32d7ceeb",
        ph: "https://photos.google.com/",
        s: "https://aistudio.google.com/prompts/new_chat"
      };
      chrome.storage.local.set({ commands: defaultCommands }, () => {
        commandMap = defaultCommands;
        console.log('Default commands have been set.');
      });
    }
  });
}

// Listen for changes in storage and update the commandMap in memory
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.commands) {
    commandMap = changes.commands.newValue;
    console.log('Commands updated in background.');
  }
});

// Initial load of commands when the extension starts
loadCommandsFromStorage();

// --- Window Size and Position Handling ---

// Debounce function to limit how often a function is called
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to save window geometry
const saveWindowBounds = debounce((windowId) => {
  if (windowId === launcherWindowId) {
    chrome.windows.get(windowId, (window) => {
      if (window && window.state !== 'minimized') {
        chrome.storage.local.set({
          launcherWidth: window.width,
          launcherHeight: window.height,
          launcherTop: window.top,
          launcherLeft: window.left
        });
      }
    });
  }
}, 250); // Wait 250ms after the last resize/move event before saving

// Listen for window resize/move events
chrome.windows.onBoundsChanged.addListener(saveWindowBounds);

// Clean up the window ID when the launcher is closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === launcherWindowId) {
    launcherWindowId = null;
  }
});

// --- Command Listeners ---

chrome.commands.onCommand.addListener((command) => {
  if (command === "open_launcher") {
    // If a launcher window is already open, focus it instead of creating a new one
    if (launcherWindowId !== null) {
      chrome.windows.update(launcherWindowId, { focused: true });
      return;
    }

    // Get last saved bounds from storage
    chrome.storage.local.get([
      'launcherWidth',
      'launcherHeight',
      'launcherTop',
      'launcherLeft'
    ], (data) => {
      chrome.windows.create({
        url: "launcher.html",
        type: "popup",
        width: data.launcherWidth || 400,
        height: data.launcherHeight || 500,
        top: data.launcherTop,
        left: data.launcherLeft,
        focused: true
      }, (window) => {
        launcherWindowId = window.id;
      });
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command) {
    // Check for the secret command first
    if (request.command === 'daisuke2048') {
      sendResponse({ url: 'secret.html' });
      return true; // Respond immediately
    }

    if (request.command === 'memo') {
      chrome.tabs.create({ url: 'memo.html' });
      sendResponse({ status: 'memo_opened' });
    } else if (request.command === 'todo') {
      chrome.tabs.create({ url: 'todo.html' });
      sendResponse({ status: 'todo_opened' });
    } else if (request.command === 'calc') {
      chrome.tabs.create({ url: 'calc.html' });
      sendResponse({ status: 'calc_opened' });
    } else if (request.command === 'si') {
      sendResponse({ url: 'si_converter.html' });
    } else {
      // If not a special command, check the user-defined commands
      const url = commandMap[request.command];
      if (url) {
        sendResponse({ url: url });
      } else {
        sendResponse({}); // Unknown command
      }
    }
  } else if (request.type === "getCommands") {
    chrome.storage.local.get('commands', (data) => {
      sendResponse({ commands: data.commands || {} });
    });
  }
  return true; // Keep the message channel open for asynchronous response
});
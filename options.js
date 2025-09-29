const commandTableBody = document.querySelector('#commands-table tbody');
const addCommandForm = document.getElementById('add-command-form');
const commandInput = document.getElementById('command-input');
const urlInput = document.getElementById('url-input');

// Render the commands table
function renderTable(commands) {
  commandTableBody.innerHTML = '';
  for (const command in commands) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${command}</td>
      <td>${commands[command]}</td>
      <td class="action-buttons">
        <button class="delete-btn" data-command="${command}">Delete</button>
      </td>
    `;
    commandTableBody.appendChild(row);
  }
}

// Get commands from storage and render the table
function loadCommands() {
  chrome.storage.local.get('commands', (data) => {
    if (data.commands) {
      renderTable(data.commands);
    }
  });
}

// Handle form submission to add a new command
addCommandForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const command = commandInput.value.trim();
  const url = urlInput.value.trim();
  if (command && url) {
    chrome.storage.local.get('commands', (data) => {
      const commands = data.commands || {};
      commands[command] = url;
      chrome.storage.local.set({ commands: commands }, () => {
        loadCommands();
        commandInput.value = '';
        urlInput.value = '';
      });
    });
  }
});

// Handle delete button clicks
commandTableBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const commandToDelete = e.target.dataset.command;
    chrome.storage.local.get('commands', (data) => {
      if (data.commands) {
        delete data.commands[commandToDelete];
        chrome.storage.local.set({ commands: data.commands }, () => {
          loadCommands();
        });
      }
    });
  }
});

// Listen for changes in storage and reload the table
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.commands) {
    renderTable(changes.commands.newValue);
  }
});

// Initial load
loadCommands();

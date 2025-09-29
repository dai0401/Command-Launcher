// Function to update the time widget
function updateTime() {
  const datetimeWidget = document.getElementById('datetime-widget');
  if (datetimeWidget) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    datetimeWidget.textContent = now.toLocaleDateString('ja-JP', options);
  }
}

// Function to display To-Do items in the popup
function displayTodos() {
  const widget = document.getElementById('todo-display-widget');
  if (!widget) return;

  chrome.storage.local.get('todoItems', (data) => {
    if (!data.todoItems || data.todoItems.length === 0) {
      widget.innerHTML = '<p style="text-align:center; margin: 5px 0;">No upcoming tasks.</p>';
      return;
    }

    const upcomingTodos = data.todoItems
      .filter(todo => !todo.completed)
      .sort((a, b) => {
        const dateTimeA = new Date(`${a.date || '1970-01-01'}T${a.time || '00:00'}`);
        const dateTimeB = new Date(`${b.date || '1970-01-01'}T${b.time || '00:00'}`);
        return dateTimeA - dateTimeB;
      });

    if (upcomingTodos.length === 0) {
      widget.innerHTML = '<p style="text-align:center; margin: 5px 0;">No upcoming tasks.</p>';
      return;
    }

    let html = '<ul class="todo-display-list">';
    const itemCount = Math.min(upcomingTodos.length, 3); // Display up to 3 items

    for (let i = 0; i < itemCount; i++) {
      const item = upcomingTodos[i];
      const date = item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }) : '';
      const time = item.time || '';
      const dateTime = `${date} ${time}`.trim();

      html += `
        <li class="todo-display-item">
          <span class="datetime">${dateTime || '-'}</span>
          <span class="content">${item.content}</span>
        </li>
      `;
    }
    html += '</ul>';
    widget.innerHTML = html;
  });
}

// Listen for changes in storage to keep the popup view synced
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.todoItems) {
    displayTodos();
  }
});

// Function to fetch, filter, and display news
function fetchNews() {
  const newsWidget = document.getElementById('news-widget');
  if (!newsWidget) return;

  const rssFeeds = [
    'http://www3.nhk.or.jp/rss/news/cat1.xml', // 社会 (for incidents)
    'http://www3.nhk.or.jp/rss/news/cat3.xml'  // 科学・医療 (for IT)
  ];

  newsWidget.innerHTML = '<p>Loading news...</p>';

  Promise.all(rssFeeds.map(url => 
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        return response.text();
      })
      .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  ))
  .then(docs => {
    let allItems = [];
    docs.forEach(doc => {
      const items = doc.querySelectorAll("item");
      allItems = [...allItems, ...items];
    });

    // Sort all items by publication date, newest first
    allItems.sort((a, b) => {
      const dateA = new Date(a.querySelector('pubDate').textContent);
      const dateB = new Date(b.querySelector('pubDate').textContent);
      return dateB - dateA;
    });

    let html = '<ul class="news-list">';
    const itemCount = Math.min(allItems.length, 3); // Display up to 3 items

    if (itemCount === 0) {
      html = '<p>No news found in selected categories.</p>';
    } else {
      for (let i = 0; i < itemCount; i++) {
        const item = allItems[i];
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        html += `<li><a href="${link}" target="_blank" rel=\"noopener\">${title}</a></li>`;
      }
      html += '</ul>';
    }
    newsWidget.innerHTML = html;

  })
  .catch(error => {
    console.error('Error fetching or parsing RSS feeds:', error);
    newsWidget.innerHTML = '<p>Failed to load news.</p>';
  });
}


// Command handling logic
function handleCommands() {
  const input = document.getElementById("commandInput");
  const resultContainer = document.getElementById("result-container");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = e.target.value.trim();
      if (cmd === '') return;

      // Clear previous result and reset style
      resultContainer.textContent = '';
      resultContainer.style.color = 'white';

      chrome.runtime.sendMessage({ command: cmd }, (response) => {
        if (chrome.runtime.lastError) {
          resultContainer.textContent = 'Error: ' + chrome.runtime.lastError.message;
          resultContainer.style.color = 'red';
          return;
        }

        if (response) {
          if (response.url) {
            chrome.tabs.create({ url: response.url });
            window.close();
          } else if (response.status === "memo_opened" || response.status === "todo_opened") {
            window.close();
          } else if (response.result) {
            resultContainer.textContent = response.result;
            // Do not clear the input, so the user can see their expression
          } else if (response.error) {
            resultContainer.textContent = response.error;
            resultContainer.style.color = 'red';
          } else {
            resultContainer.textContent = "Unknown command: " + cmd.toLowerCase();
            resultContainer.style.color = 'orange';
          }
        }
      });
    }
  });
}

// Run when the window loads
window.onload = () => {
  handleCommands();
  displayTodos();
  updateTime();
  setInterval(updateTime, 1000);
  fetchNews();
};
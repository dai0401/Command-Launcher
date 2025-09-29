chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_SELECTION') {
    const selection = window.getSelection().toString();
    sendResponse({ selection });
  }
  return true;
});
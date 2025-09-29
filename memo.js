document.addEventListener('DOMContentLoaded', () => {
  const memoContent = document.getElementById('memo-content');

  // Get both memo and selectedText at once
  chrome.storage.local.get(['memo', 'selectedText'], (result) => {
    let memo = result.memo || '';
    const selectedText = result.selectedText;

    // If there's selected text (even an empty string), append it to the memo
    if (typeof selectedText === 'string') {
      const separator = memo.length > 0 ? '\n\n' : '';
      memo += separator + selectedText;
      
      // Save the updated memo and remove the temporary selectedText
      chrome.storage.local.set({ 'memo': memo });
      chrome.storage.local.remove('selectedText');
    }

    // Set the final text to the textarea
    memoContent.value = memo;

    // Focus the textarea so the user can start typing
    memoContent.focus();
    // Move the cursor to the end of the text
    memoContent.selectionStart = memoContent.selectionEnd = memoContent.value.length;
  });

  // Add listener to save any subsequent changes on input
  memoContent.addEventListener('input', () => {
    chrome.storage.local.set({ 'memo': memoContent.value });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // --- Elements ---
  const widthValue = document.getElementById('width-value');
  const heightValue = document.getElementById('height-value');
  const widthPlusBtn = document.getElementById('width-plus');
  const widthMinusBtn = document.getElementById('width-minus');
  const heightPlusBtn = document.getElementById('height-plus');
  const heightMinusBtn = document.getElementById('height-minus');

  const SIZE_STEP = 10; // px
  const DEFAULT_WIDTH = 350;
  const DEFAULT_HEIGHT = 220;

  let currentWidth, currentHeight;

  // --- Functions ---

  // Update the displayed values on the page
  const updateUI = () => {
    widthValue.textContent = `${currentWidth}px`;
    heightValue.textContent = `${currentHeight}px`;
  };

  // Get values from storage and initialize the page
  const loadInitialValues = () => {
    chrome.storage.sync.get(['popupWidth', 'popupHeight'], (result) => {
      currentWidth = result.popupWidth || DEFAULT_WIDTH;
      currentHeight = result.popupHeight || DEFAULT_HEIGHT;
      updateUI();
    });
  };

  // Save the current values to storage
  const saveValues = () => {
    chrome.storage.sync.set({
      popupWidth: currentWidth,
      popupHeight: currentHeight
    });
  };

  // --- Event Listeners ---
  widthPlusBtn.addEventListener('click', () => {
    currentWidth += SIZE_STEP;
    updateUI();
    saveValues();
  });

  widthMinusBtn.addEventListener('click', () => {
    if (currentWidth > 100) { // Set a minimum width
      currentWidth -= SIZE_STEP;
      updateUI();
      saveValues();
    }
  });

  heightPlusBtn.addEventListener('click', () => {
    currentHeight += SIZE_STEP;
    updateUI();
    saveValues();
  });

  heightMinusBtn.addEventListener('click', () => {
    if (currentHeight > 100) { // Set a minimum height
      currentHeight -= SIZE_STEP;
      updateUI();
      saveValues();
    }
  });

  // --- Initial Load ---
  loadInitialValues();
});

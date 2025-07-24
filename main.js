 let items = [];

/**
 * Adds an item to the list from the input field.
 */
function addItem() {
    const input = document.getElementById('itemInput');
    const value = input.value.trim();

    if (value) {
        items.push(value);
        input.value = '';
        updateDisplay();
        updatePickButton();
    }        
}


/**
 * Removes an item from the list.
 * @param {number} index - The index of the item to remove.
 */
function removeItem(index) {
    items.splice(index, 1);
    updateDisplay();
    updatePickButton();
}

/**
 * Updates the display of items in the list.
 *
 * TODO: add wheel of fortune style animation
 */
function updateDisplay() {
    const list = document.getElementById('itemsList');

    if (items.length === 0) {
        list.innerHTML = '<div class="empty-state">No items added yet. Add some items to get started!</div>';
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="item">
            <span class="item-text">${item}</span>
            <button class="btn-remove" onclick="removeItem(${index})" title="Remove item">×</button>
        </div>
    `).join('');
}

function updatePickButton() {
    const btn = document.getElementById('pickBtn');
    btn.disabled = items.length === 0;
}

function pickRandom() {
    if (items.length === 0) return;

    const result = document.getElementById('result');
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];

    // Add animation class
    result.classList.add('animate');
    result.textContent = `${selectedItem}`;
    result.classList.add('show');

    // Remove animation class after animation completes
    setTimeout(() => {
        result.classList.remove('animate');
    }, 600);
}

function clearAll() {
    if (items.length === 0) return;

    items = [];
    updateDisplay();
    updatePickButton();

    const result = document.getElementById('result');
    result.classList.remove('show');
    setTimeout(() => {
        result.textContent = 'Ready to pick! Add some items first.';
    }, 300);
}

// Allow adding items with Enter key
document.getElementById('itemInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addItem();
    }
});

// Initialize display
updateDisplay();
 // -------------------- global variables --------------------
 let items = [];
 let currentWinner = null;

// ------------------- listeners -------------------
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
    });
}

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Allow adding items with Enter key
    const itemInput = document.getElementById('itemInput');
    if (itemInput) {
        itemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addItem();
            }
        });
    }

    // Initialize display
    updateWheel();
    updateItemsList();
    updateDisplay();
});


// -------------------- functions --------------------
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

/**
 * updates pick button depending on list length
 */
function updatePickButton() {
    const btn = document.getElementById('pickBtn');
    btn.disabled = items.length === 0;
}

/**
 *  Picks a random item from the list and displays it in a modal.
 */
function pickRandom() {
    if (items.length === 0) return;

    const result = document.getElementById('result');
    const randomIndex = Math.floor(Math.random() * items.length);
    const selectedItem = items[randomIndex];

    currentWinner = selectedItem;
    showResultModal(selectedItem);
}

/**
 * Clears all items from the list and updates the display.
 */
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

/**
 * displays the result modal with the winning item.
 * 
 * @param {string} winner - The item that won.
 */
function showResultModal(winner) {
    const modal = document.getElementById('resultModal');
    const modalResult = document.getElementById('modalResult');
    
    if (modal && modalResult) {
        modalResult.textContent = winner;
        modal.classList.add('show');
    }
}

/**
 * Closes the result modal and resets the current winner.
 */
function closeModal() {
    const modal = document.getElementById('resultModal');
    if (modal) {
        modal.classList.remove('show');
        currentWinner = null;
    }
}

/*
* removes the current winner from the list and updates the display.
*/
function removeWinner() {
    if (currentWinner) {
        const index = items.indexOf(currentWinner);
        if (index > -1) {
            items.splice(index, 1);
            //updateWheel();
            updateDisplay();
            updatePickButton();
        }
        closeModal();
    }
}

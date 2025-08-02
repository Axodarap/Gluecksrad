 // -------------------- global variables --------------------
 let items = [];
 let currentWinner = null;
 let isSpinning = false;
 let currentAngle = 0;

 const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FFB347', '#87CEEB', '#F0E68C', '#FF69B4',
    '#90EE90', '#FFA07A', '#20B2AA', '#9370DB', '#32CD32'
];

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
        updateSpinButton();
    }        
}


/**
 * Removes an item from the list.
 * @param {number} index - The index of the item to remove.
 */
function removeItem(index) {
    items.splice(index, 1);
    updateDisplay();
    updateSpinButton();
}

/**
 * updates spin button depending on list length
 */
function updateSpinButton() {
    const btn = document.getElementById('spinBtn');
    btn.disabled = items.length === 0 || isSpinning;
}

/**
 *  OBSOLETE
 * 
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
    updateSpinButton();

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
        isSpinning = false;
        updateSpinButton();
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
            updateDisplay();
        }
        closeModal();
    }
}

/**
 * Updates the display of items in the list + the wheel.
 */
function updateDisplay() {
    const list = document.getElementById('itemsList');
    const wheelContainer = document.getElementById('wheelContainer');

    if (items.length === 0) {
        list.innerHTML = '<div class="empty-state">No items added yet. Add some items to get started!</div>';
        wheelContainer.innerHTML = '<div class="empty-wheel">Add items to create<br>your wheel!</div>';
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="item">
            <span class="item-text">${item}</span>
            <button class="btn-remove" onclick="removeItem(${index})" title="Remove item">×</button>
        </div>
    `).join('');

    const wheelHTML = `
        <div class="wheel" id="wheel">
            <canvas id="wheelCanvas" width="334" height="334"></canvas>
            <div class="wheel-center"></div>
        </div>
    `;
    wheelContainer.innerHTML = wheelHTML;

    drawWheel();
}


// --------------------- wheel section --------------------------
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (items.length === 0) return;

    const segmentAngle = (2 * Math.PI) / items.length;

    const startOffset = -Math.PI / 2;

    items.forEach((item, index) => {
        const startAngle = startOffset - index * segmentAngle;
        const endAngle = startAngle - segmentAngle;
        const color = colors[index % colors.length];
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, counterclockwise=true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Draw segment border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        const textAngle = startAngle - segmentAngle / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Handle long text
        if (item.length > 12) {
            const words = item.split(' ');
            if (words.length > 1) {
                ctx.fillText(words[0], 0, -8);
                ctx.fillText(words.slice(1).join(' '), 0, 8);
            } else {
                ctx.font = 'bold 12px Arial';
                ctx.fillText(item, 0, 0);
            }
        } else {
            ctx.fillText(item, 0, 0);
        }

        ctx.restore();
    });
}

/*
* spins the wheel --> still sometimes get wrong result
*/
function spinWheel() {
    if (items.length === 0 || isSpinning) return;

    isSpinning = true;
    updateSpinButton();

    const wheel = document.getElementById('wheel');
    const segmentAngle = 360 / items.length;

    // Random angle between 0 and 360 degrees
    const randomAngle = Math.random() * 360;

    // Total rotation is full rotations plus random angle
    const finalAngle = currentAngle + 6 * 360 + randomAngle;       // TODO avoid magic constants
  
    // Apply rotation with smooth transition   TODO: make transition time configurable and more elegant
    wheel.style.transition = 'transform 4s ease-out';
    wheel.style.transform = `rotate(${finalAngle}deg)`;

   
    setTimeout(() => {
        // Determine index of segment the pointer lands on
        let selectedIndex = angle2index(randomAngle, currentAngle, items.length);

        const selectedItem = items[selectedIndex];
        currentWinner = selectedItem;
        showResultModal(selectedItem);

        // Reset transition for next spin and fix wheel rotation angle to normalized angle
        wheel.style.transition = 'none';
        wheel.style.transform = `rotate(${finalAngle % 360}deg)`;

        isSpinning = false;
        updateSpinButton();

        // save new angle
        currentAngle = finalAngle % 360;
    }, 4000);  
}

/*
 * Converts an angle in degrees to the corresponding index in the wheel
 */
function angle2index(phi, phi_0, num_items) {
    const segmentAngle = 360 / num_items;
    return Math.floor(((phi + phi_0) % 360) / segmentAngle);
}

let currentRotation = 0;
let items = [1,2,3,4,5,6,7,8];
let canvas = document.getElementById('wheelCanvas');


const colors = [
  '#D84315', // Red
  '#388E3C', // Green
  '#FBC02D', // Yellow
  '#F57C00', // Orange
  '#0288D1', // Light Blue
  '#7B1FA2', // Purple
  '#C2185B', // Magenta
  '#009688'  // Teal
];

let setSegmentOutlines = false; // Set to true to enable white outlines around segments

function spinWheel() {
    const wheel = document.getElementById('wheelCanvas'); // Changed from 'wheelContainer' to 'wheel'
    const spinDegrees = 1080 + Math.floor(Math.random() * 360); // 3 full spins + randomness
    currentRotation += spinDegrees;
    
    wheel.style.transition = 'transform 4s ease-out';
    wheel.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`; // Keep the centering transform
    
    setTimeout(() => {
        // Normalize to within 360 degrees for consistency
        currentRotation = currentRotation % 360;
        wheel.style.transition = 'none';
        wheel.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
    }, 4000);
}

function updateDisplay() {
    const itemListContainer = document.getElementById('itemListContainer');
    // Clear existing content
    itemListContainer.innerHTML = '';
    
    if (items.length === 0) {
        itemListContainer.innerHTML = '<div class="empty-list-message">No items added yet. Add some items to spin!</div>';
        // TODO: handle wheel
        return;
    }
    // Create the list container
    const itemList = document.createElement('div');
    itemList.className = 'item-list';
    
    items.forEach((item, index) => {
        const itemEntry = document.createElement('div');
        itemEntry.className = 'item-entry';
        
        // Item text
        const itemText = document.createElement('div');
        itemText.className = 'item-text';
        itemText.textContent = item;
        
        // Remove button
        const removeButton = document.createElement('button');
        removeButton.className = 'btn-remove';
        removeButton.textContent = '✕';
        removeButton.onclick = () => removeItem(index);
        
        // Assemble the item entry
        itemEntry.appendChild(itemText);
        itemEntry.appendChild(removeButton);
        
        itemList.appendChild(itemEntry);
    });
    
    itemListContainer.appendChild(itemList);

    drawWheel();
}

function addItem() {
    const input = document.getElementById('itemInput');
    const value = input.value.trim();
    
    if (value) {
        items.push(value);
        input.value = '';
        drawWheel();
        populateItemList();
    }
}

function removeItem(index) {
    items.splice(index, 1);
    updateDisplay();
}

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  return { ctx, width: rect.width, height: rect.height };
}

function drawWheel(){

    const lineWidth = 5; // Width of the lines between segments

    const { ctx, width, height } = setupCanvas(canvas);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2;

    ctx.clearRect(0, 0, width, height);

    const segmentAngle = (2 * Math.PI) / items.length;
    const startOffset = -Math.PI / 2;

    items.forEach((item, index) => {
        const startAngle = startOffset - index * segmentAngle;
        const endAngle = startAngle - segmentAngle;
        const color = colors[index % colors.length];
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        if(setSegmentOutlines)
            ctx.strokeStyle = '#fff';
        else
            ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        const textAngle = startAngle - segmentAngle / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + Math.cos(textAngle) * textRadius;
        const textY = centerY + Math.sin(textAngle) * textRadius;

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 44px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

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
    // Draw black center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#000'; // black color
    ctx.fill();
}

// Listen to both for full coverage
//if (window.visualViewport) {
//  window.visualViewport.addEventListener('resize', handleResize);
//}
window.addEventListener('resize', handleResize);

function handleResize() {
  requestAnimationFrame(() => {
    updateDisplay(); // safely use updated sizes here
  });
}


updateDisplay();
var blocks = [];
var htmlOutput = '';
var firstSelection;
var firstSelectionIndex;
var secondSelection;
var secondSelectionIndex;

// display today's date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var dateDisplay = document.getElementById('date');
dateDisplay.innerText = today.toLocaleDateString('en-US', options);

// create grid
for (let i = 0; i < 6; i++) {
    htmlOutput += '<div id="' + i + '" class="block empty"></div>';
    blocks.push({
        id: 'block' + i,
        status: 'empty',
        duration: 15,
        isStartTime: false,
        isEndTime: false
    });
}

// output blocks to DOM
var grid = document.getElementById('grid');
grid.innerHTML = htmlOutput; // TODO: use nodes instead of innerHTML

// add click listeners
document.querySelectorAll('.block').forEach(item => {
    item.addEventListener('click', event => {
        handleBlockClick(item);
    })
});

function handleBlockClick(item) {
    blocks[item.id].status = 'active';
    item.classList.add('active');

    if (firstSelection == null) {
        firstSelection = blocks[item.id];
        blocks[item.id].isStartTime = true;
        firstSelectionIndex = blocks.findIndex(isStartTime); // findIndex method is not supported in IE
        console.log('first selection: ' + firstSelectionIndex);
    }
    else {
        secondSelection = blocks[item.id];
        blocks[item.id].isEndTime = true;
        secondSelectionIndex = item.id;
        console.log('first selection: ' + firstSelectionIndex + ', second selection: ' + secondSelectionIndex);

        for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
            let blockDiv = document.getElementById(i);
            blockDiv.classList.add('active');
        }
    }
}

function isStartTime(block) {
    return block.isStartTime === true;
}
var blocks = [];
var htmlOutput = '';
var isSelecting = false;
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
for (let i = 0; i < 8; i++) {
    if (i%4 == 0) {
        htmlOutput += '<br>'
    }
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

// add click listener to all blocks
document.querySelectorAll('.block').forEach(item => {
    item.addEventListener('click', event => {
        handleBlockClick(item);
    })
});

var saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', event => {
    handleSaveClick();
});

function handleSaveClick () {
    saveButton.setAttribute('disabled', '');
    firstSelection.isStartTime = false;
    secondSelection.isEndTime = false;

    // highlight selected range
    for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
        let blockDiv = document.getElementById(i);
        blocks[i].status = 'filled';
        blockDiv.classList.remove('active', 'selected');
        blockDiv.classList.add('filled');
    }
    console.log(blocks);
}

function handleBlockClick (item) {
    if (isSelecting === false) {
        isSelecting = true;
        firstSelection = blocks[item.id];
        firstSelection.isStartTime = true;
        firstSelection.status = 'selected';
        item.classList.remove('empty');
        item.classList.add('active', 'selected');
        firstSelectionIndex = blocks.findIndex(isStartTime); // findIndex method is not supported in IE
        console.log('first selection: ' + firstSelectionIndex);
        console.log(blocks);
    }
    else {
        isSelecting = false;
        saveButton.removeAttribute('disabled');
        secondSelection = blocks[item.id];
        secondSelectionIndex = item.id;

        // reset selection if you try to go backwards
        if (secondSelectionIndex < firstSelectionIndex) {
            let firstSelectionDiv = document.getElementById(firstSelectionIndex);
            firstSelectionDiv.classList.add('empty');
            firstSelectionDiv.classList.remove('active', 'selected');
            firstSelection.isStartTime = false;
            firstSelection.status = 'empty';
            saveButton.setAttribute('disabled', '');
        }
        else {
            secondSelection.isEndTime = true;
            item.classList.add('active');
        }

        console.log('first selection: ' + firstSelectionIndex + ', second selection: ' + secondSelectionIndex);
        console.log(blocks);

        // highlight selected range
        for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
            let blockDiv = document.getElementById(i);
            blocks[i].status = 'selected';
            blockDiv.classList.remove('empty');
            blockDiv.classList.add('selected');
        }
    }
}

function isStartTime(block) {
    return block.isStartTime === true;
}
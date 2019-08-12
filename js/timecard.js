/* TODO:

- add unique colors per project
- show total hours logged
- show colors of projects in total
- allow second click to remove blocks as long as it's after the first selection
- allow second click to add time if it's still touching the current selection
- allow blocks ranges to be selected backwards
- save to local storge
- add a Clear All button
- add a way to empty a filled timeslot (or range)
- remove temp object properties
- add responsive styles
- clean up code

*/

var blocks = [];
var htmlOutput = '';
var isSelecting = false;
var firstSelection;
var firstSelectionIndex;
var secondSelection;
var secondSelectionIndex;
var hour = 8;
var suffix = 'am';
var colorPattern = ['#581d7f', '#c8488a', '#f6b5a4', '#872e93', '#3a1353', '#eb7590'];
var form = document.getElementById('form');

// display today's date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var dateDisplay = document.getElementById('date');
dateDisplay.innerText = today.toLocaleDateString('en-US', options);

// create timeslot grid
for (let i = 0; i < 40; i++) {
    if (i % 4 == 0) {
        if (i > 12) {
            suffix = 'pm';
        }
        htmlOutput += '<br> <span class="time-label">' + hour + suffix + '</span>';
        hour++;
        if (hour > 12) {
            // changes 13:00 to 1:00
            hour = 1;
        }
    }
    htmlOutput += '<div id="' + i + '" class="block empty"></div>';
    blocks.push({
        status: 'empty',
        isStartTime: false, // temp
        isEndTime: false // temp
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

var projectListSelection = document.getElementById('projectList');

function handleSaveClick () {
    if (projectListSelection.value) {
        form.setAttribute('hidden', '');
        saveButton.setAttribute('disabled', '');
        firstSelection.isStartTime = false;
        secondSelection.isEndTime = false;

        // highlight selected range
        for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
            let blockDiv = document.getElementById(i);
            blocks[i].status = 'filled';
            blocks[i].project = projectListSelection.value;
            blockDiv.classList.remove('active', 'selected');
            blockDiv.classList.add('filled');
            blockDiv.style.backgroundColor = colorPattern[0];
        }

        // cycle through colors
        colorPattern.push(colorPattern.shift());
        console.log(blocks);
    } else {
        console.log('Choose a project');
    }
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
    }
    else {
        isSelecting = false;
        form.removeAttribute('hidden', '');
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
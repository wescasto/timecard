/* TODO:

- add unique colors per project
- populate dropdown dynamically
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
var errorMessage = document.getElementById('errorMessage');

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
var projectInput = document.getElementById('projectInput');

function handleSaveClick () {
    if (projectInput.value || projectListSelection.value) {
        // highlight selected range
        for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
            let blockDiv = document.getElementById(i);
            blocks[i].status = 'filled';
            blockDiv.classList.remove('active', 'selected');
            blockDiv.classList.add('filled');
            blockDiv.style.backgroundColor = colorPattern[0];
            
            if (projectInput.value) {
                // set project to input text
                blocks[i].project = projectInput.value;
            }
            else {
                // set project to dropdown item
                blocks[i].project = projectListSelection.value;
            }
        }

        // reset form and values
        errorMessage.innerText = '';
        projectInput.value = '';
        projectListSelection.value = '';
        form.setAttribute('hidden', '');
        saveButton.setAttribute('disabled', '');
        firstSelection.isStartTime = false;
        secondSelection.isEndTime = false;

        // cycle through colors
        colorPattern.push(colorPattern.shift());
        updateTotal();
    }
    else {
        errorMessage.innerText = 'Select a project';
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
        //console.log('first selection: ' + firstSelectionIndex);
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

        //console.log('first selection: ' + firstSelectionIndex + ', second selection: ' + secondSelectionIndex);

        // highlight selected range
        for (var i = secondSelectionIndex; i >= firstSelectionIndex; i--) {
            let blockDiv = document.getElementById(i);
            blocks[i].status = 'selected';
            blockDiv.classList.remove('empty');
            blockDiv.classList.add('selected');
        }
    }
}

function isStartTime (block) {
    return block.isStartTime === true;
}

var totalText = document.getElementById('totalText');

function updateTotal () {
    // create array of project names
    var projectNames = blocks.map(a => a.project);

    // count unique occurances of projects
    var obj = {};
    projectNames.forEach(function(item) {
        if (typeof obj[item] == 'number') {
            obj[item]++;
        }
        else {
            obj[item] = 1;
        }
    });

    totalText.innerHTML = Object.keys(obj).map(function(item) {
        if (item !== 'undefined') {
            return '<div class="total-row"><span class="item">' + item + ': </span><span class="count">' + obj[item] * 15 / 60 + 'h</span></div>';
        }
    }).join('');
}
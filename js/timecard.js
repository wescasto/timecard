var blocks = [];
var htmlOutput = '';
var firstSelection;
var secondSelection;

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
        duration: 15
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
        console.log(firstSelection);
    } else {
        secondSelection = blocks[item.id];
        console.log(secondSelection);
    }
}
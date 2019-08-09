var blocks = [];
var htmlOutput = '';

// display today's date
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var dateDisplay = document.getElementById('date');
dateDisplay.innerText = today.toLocaleDateString("en-US", options);

// create grid
for (let i = 0; i < 4; i++) {
    htmlOutput += '<div id="' + i + '" class="block empty">B</div>';
    blocks.push({
        id: 'block' + i,
        status: 'empty'
    });
}

// output blocks to DOM
var grid = document.getElementById('grid');
grid.innerHTML = htmlOutput;

// register click listeners
document.querySelectorAll('.block').forEach(item => {
    item.addEventListener('click', event => {
        handleBlockClick(item);
    })
});

function handleBlockClick(item) {
    blocks[item.id].status = 'clicked';
    item.classList.add('clicked');
    console.log(blocks);
}

// output all blocks
/*
blocks.forEach(function(item, index, array) {
    console.log(item, index);
});
*/
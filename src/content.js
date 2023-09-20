floatingDivHtml = `
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<div id="floatingDiv">
    <div id="summary">
        <label for="thresholdInput">Positive Bids:</label>
        <span><span id="countText"/></span>
        <span id="toggleIndicator" class="clickable">
            <i class="material-icons">expand_more</i>
            <i class="material-icons" style="display: none;">expand_less</i>
        </span>
    </div>
    <!-- Table (initially hidden) -->
    <div id="countTableContainer" style="display: none;">
        <!-- Table content will be rendered here -->
    </div>
</div>
`

// Function to load and insert the HTML content from an external file
async function loadFloatingDivStructure() {
    try {
        // find a place to insert the html and add it
        const html = floatingDivHtml;
        const selector = '#f-search';
        const targetElement = document.querySelector(selector);
        if (!targetElement) return;
        targetElement.insertAdjacentHTML('afterend', html);

        const toggleIndicator = document.getElementById('toggleIndicator');
        let isExpanded = false;

        // add an event listener to the icons that show/hide the table.
        toggleIndicator.addEventListener('click', () => {
            isExpanded = !isExpanded;
            const plusIcon = toggleIndicator.querySelector('i:nth-child(1)');
            const minusIcon = toggleIndicator.querySelector('i:nth-child(2)');
            plusIcon.style.display = isExpanded ? 'none' : 'inline';
            minusIcon.style.display = isExpanded ? 'inline' : 'none';

            const tableContainer = document.getElementById('countTableContainer');
            tableContainer.style.display = isExpanded ? 'block' : 'none';
        });
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}


// Function to update the counts and display them
function updatePreferenceCounts() {
    const preferenceCounts = {};
    let positiveBids = 0;

    const preferences = document.querySelectorAll('input.revpref');
    preferences.forEach(input => {
        const value = parseInt(input.value, 10);
        if (!isNaN(value) && value > 0) {
            positiveBids++;
            preferenceCounts[value] = (preferenceCounts[value] || 0) + 1;
        }
    });

    document.getElementById('countText').textContent = positiveBids;
    renderCountsAsTable(preferenceCounts);
}


function renderCountsAsTable(counts) {
    const table = document.createElement('table');
    table.id = 'PrefTable';

    // order the entries in the table so they are ascending
    const sortedEntries = Object.entries(counts)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    table.innerHTML = `
        <thead>
            <tr>
                <th>Preference</th>
                <th>Count</th>
            </tr>
        </thead>
        <tbody>
            ${sortedEntries.map(([value, count]) => `
                <tr>
                    <td>${value}</td>
                    <td>${count}</td>
                </tr>
            `).join('')}
        </tbody>
    `;

    // clear the div of old content and attach the new html for the table
    const container = document.getElementById('countTableContainer');
    container.innerHTML = '';
    container.appendChild(table);
}

// load the html, attach event listeners, and set the initial counts
loadFloatingDivStructure().then( () => {

    // Add an event listener to recalculate counts when preferences change
    let inputs = document.querySelectorAll('input.revpref');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreferenceCounts);
    });

    // set the initial preference counts
    updatePreferenceCounts();
});


function getThreshold(callback) {  
    chrome.runtime.sendMessage({ method: 'getThreshold' }, (response) => {  
      callback(response.threshold);  
    });  
  }  
    
  function setThreshold(threshold) {  
    chrome.runtime.sendMessage({ method: 'setThreshold', threshold: threshold });  
  }  

floatingDivHtml = `
<!-- floatingDiv.html -->
<div id="floatingDiv">
    <!-- Summary (initially visible) -->
    <div id="summary">
        <label for="thresholdInput">Preference cut-off (inclusive): </label>
        <input type="number" id="thresholdInput" value="10">
        <span>Count: <span id="countText"/></span>
        <button id="toggleButton">Show Details</button> <!-- Button to toggle table visibility -->
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
        const html = floatingDivHtml;
        const selector = '#f-search';
        const targetElement = document.querySelector(selector);
        if (!targetElement) return;
        targetElement.insertAdjacentHTML('afterend', html);

        // Add a click event listener to the toggle button
        const toggleButton = document.getElementById('toggleButton');
        toggleButton.addEventListener('click', toggleTableVisibility);
    } catch (error) {
        console.error('Error loading HTML:', error);
    }
}

// Call the function to load the HTML content during initialization
loadFloatingDivStructure();//.then( () =>
//{
//    // Add a click event listener to the toggle button
//    const toggleButton = document.getElementById('toggleButton');
//    toggleButton.addEventListener('click', toggleTableVisibility);
//}
//);

// Function to toggle the visibility of the table
function toggleTableVisibility() {
    const tableContainer = document.getElementById('countTableContainer');
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        document.getElementById('toggleButton').textContent = 'Hide Details';
    } else {
        tableContainer.style.display = 'none';
        document.getElementById('toggleButton').textContent = 'Show Details';
    }
}



// Data structure to store preference counts
const preferenceCounts = {};

// Function to update the counts and display them
function updatePreferenceCounts() {
    console.log("updating preference counts...");
    // Reset counts
    Object.keys(preferenceCounts).forEach(key => preferenceCounts[key] = 0);

    // Collect counts from preferences on the page
    const preferences = document.querySelectorAll('input.revpref');
    preferences.forEach(input => {
        const value = parseInt(input.value, 10);
        if (!isNaN(value)) {
            if (!preferenceCounts[value]) {
                preferenceCounts[value] = 1;
            } else {
                preferenceCounts[value]++;
            }
        }
    });

    //output the preference counts
    console.log(`preference counts ${preferenceCounts}`);
    for (const value in preferenceCounts)
    {
        console.log(`pref ${value} : ${preferenceCounts[value]}`);
    }

    renderCountsAsTable(preferenceCounts);
    // Update the UI to display the counts
    // You can choose the format (e.g., a table) to display the counts here
    // Example: renderCountsAsTable(preferenceCounts);
}

// Function to render the counts as a table (example)
function renderCountsAsTable(counts) {
    const table = document.createElement('table');
    table.id = 'PrefTable';
    // Create thead element
    const thead = document.createElement('thead');
    table.appendChild(thead);

    // Set the innerHTML of the thead
    thead.innerHTML = `
        <tr>
            <th>Pref</th>
            <th>Count</th>
        </tr>
    `;
    const tbody = document.createElement('tbody');
    
    for (const value in counts) {
        const row = document.createElement('tr');
        const cellValue = document.createElement('td');
        const cellCount = document.createElement('td');
        
        cellValue.textContent = value;
        cellCount.textContent = counts[value];
        
        row.appendChild(cellValue);
        row.appendChild(cellCount);
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    
    // Clear existing UI and append the new table
    const countTextElement = document.getElementById('countTableContainer');
    countTextElement.innerHTML = '';
    countTextElement.appendChild(table);
}

// Add an event listener to recalculate counts when preferences change
let inputs = document.querySelectorAll('input.revpref');
inputs.forEach(input => {
    input.addEventListener('input', updatePreferenceCounts);
});

// Call updatePreferenceCounts during initialization
updatePreferenceCounts();




// Function to append a number input and a text element to a given HTML element
function appendElements(selector) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    html = `
        <div id="floatingDiv">
            <label for="thresholdInput">Preference threshold (inclusive): </label>
            <input type="number" id="thresholdInput" value="10">
            <span>Count:<span id="countText"/></span>
        </div>
    `;
    targetElement.insertAdjacentHTML('afterend', html);
    const numberInput = document.getElementById('thresholdInput');

    // Add event listener to the number input to recompute the count when its value changes
    numberInput.addEventListener('input', countInputsGreaterThanThreshold);

    // Load the stored threshold value from the background script  
    getThreshold((storedThreshold) => {  
        if (storedThreshold) {  
            numberInput.value = storedThreshold;  
            countInputsGreaterThanThreshold();  
        }  
    });  

}

function countInputsGreaterThanThreshold() {
    const threshold = parseInt(document.getElementById('thresholdInput').value, 10) || 10;

    // Store the threshold value using the background script  
    setThreshold(threshold);  
    
    //grab all the input cells in the preferences page
    let inputs = document.querySelectorAll('input.revpref');
    let count = 0;

    inputs.forEach(input => {
        let value = parseInt(input.value, 10);
        if (!isNaN(value) && value >= threshold) {
            count++;
        }
    });

    // Update the text element with the count
    document.getElementById('countText').textContent = `${count}`;
    return count;
}

// Attach event listeners to each input element
let inputs2 = document.querySelectorAll('input.revpref');
inputs2.forEach(input => {
    input.addEventListener('input', countInputsGreaterThanThreshold);
});

appendElements('#f-search');

// Count the inputs on page load
countInputsGreaterThanThreshold();

console.log('content.js loaded');

// Function to append a number input and a text element to a given HTML element
function appendElements(selector) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    html = `
    <style>
    #floatingDiv {
        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background-color: white;
        padding: 15px 20px;
        border-bottom: 2px solid #ccc;
        width: auto;
        box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.1);
        font-family: 'Arial', sans-serif; /* A more readable font */
        border-radius: 0 0 5px 5px; /* Rounded corners at the bottom */
    }

    #floatingDiv label,
    #floatingDiv input,
    #floatingDiv span {
        margin-right: 10px; /* Spacing between elements */
    }

    #thresholdInput {
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 3px; /* Slightly rounded corners for the input */
        transition: border 0.3s; /* Smooth transition for hover effects */
    }

    #thresholdInput:hover {
        border-color: #999; /* Change border color on hover */
    }

    #thresholdInput:focus {
        border-color: #666; /* Change border color on focus */
        outline: none; /* Remove the default browser outline */
    }
</style>

<div id="floatingDiv">
    <label for="thresholdInput">Preference cut-off (inclusive): </label>
    <input type="number" id="thresholdInput" value="10">
    <span>Count:<span id="countText"/></span>
</div>

    `;
    targetElement.insertAdjacentHTML('afterend', html);

    // Create a text element (span) to display the count
    const numberInput = document.getElementById('thresholdInput');

    // Add event listener to the number input to recompute the count when its value changes
    numberInput.addEventListener('input', countInputsGreaterThanThreshold);

}

// Modified function to use the value from the number input as the threshold
function countInputsGreaterThanThreshold() {
    const threshold = parseInt(document.getElementById('thresholdInput').value, 10) || 10;
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
let inputs = document.querySelectorAll('input.revpref');
inputs.forEach(input => {
    input.addEventListener('input', countInputsGreaterThanThreshold);
});

appendElements('#f-search');

// Count the inputs on page load
countInputsGreaterThanThreshold();

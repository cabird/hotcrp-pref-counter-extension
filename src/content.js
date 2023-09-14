function getThreshold(callback) {  
    chrome.runtime.sendMessage({ method: 'getThreshold' }, (response) => {  
      callback(response.threshold);  
    });  
  }  
    
  function setThreshold(threshold) {  
    chrome.runtime.sendMessage({ method: 'setThreshold', threshold: threshold });  
  }  

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
let inputs = document.querySelectorAll('input.revpref');
inputs.forEach(input => {
    input.addEventListener('input', countInputsGreaterThanThreshold);
});

appendElements('#f-search');

// Count the inputs on page load
countInputsGreaterThanThreshold();

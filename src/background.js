chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {  
    if (request.method === 'getThreshold') {  
      chrome.storage.local.get('threshold', (data) => {  
        sendResponse({ threshold: data.threshold });  
      });  
      return true;  
    } else if (request.method === 'setThreshold') {  
      chrome.storage.local.set({ threshold: request.threshold });  
    }  
  });  

  
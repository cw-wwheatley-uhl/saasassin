// Create Context Menus
chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
        id: "Test",
        title: "Test: %s",
        contexts:["selection"]
    });
});

// listens for Context Menu Click
chrome.contextMenus.onClicked.addListener( (info,tab) => {
    if ( 'Test'  === info.menuItemId ) {
        var msg = info.selectionText;
        var tab = getCurrentTab();
        var currTab = tab.then( value => { 
            console.log("This is the Tab Id: " + value);
            sendAMessage(value, msg);
        });
    }
});

//  Sends Message to Content.js
async function sendAMessage(value, msg) {
    chrome.tabs.sendMessage(value, {message: msg}, function(response) {
        console.log(response.status);
    });
}

// Gets active tab ID int
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}
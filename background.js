// Create Context Menus
chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
        id: "main",
        title: "SaaSassin",
        contexts:["selection"]
    });
    chrome.contextMenus.create({
        id: "firstChild",
        parentId: "main",
        title: "Butt!",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "line",
        parentId: "main",
        type: "separator",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "secondChild",
        parentId: "main",
        title: "MAIN:",
        contexts: ["selection"]
    });

});

// listens for Context Menu Click
chrome.contextMenus.onClicked.addListener( (info,tab) => {
    if ( 'Child'  === info.menuItemId ) {
        const msg = info.selectionText;
        let tab = getCurrentTab();
        let currTab = tab.then( value => { 
            // console.log("This is the Tab Id: " + value);
            sendAMessage(value, msg);
        });
    }
});

//  Sends Message to Content.js
async function sendAMessage(value, msg) {
    chrome.tabs.sendMessage(value, {type: "ATYPICAL", message: msg}, function(response) {
        console.log("Response: " + response.status);
    });
}

// Gets active tab ID int
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}
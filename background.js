// Create Context Menus
chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
        id: "main",
        title: "SaaSassin",
        contexts:["all"]
    });
    chrome.contextMenus.create({
        id: "parse",
        parentId: "main",
        title: "PARSE:",
        contexts: ["all"]
    });
    chrome.contextMenus.create({
        id: "useSelected",
        parentId: "parse",
        title: "Use Selected Text...",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "useClipboard",
        parentId: "parse",
        title: "Use Clipboard text...",
        contexts: ["page", "selection"]
    });

});

// listens for Context Menu Click
chrome.contextMenus.onClicked.addListener( (info,tab) => {
    if ( 'useSelected'  === info.menuItemId ) {
        const msg = info.selectionText;
        // let tab = getCurrentTab();
        // let currTab = tab.then( tabId => { 
            // sendAMessage(tabId, msg);
        // });
        getCurrentTab().then( tabId => { 
			const type = "useSelected"
        	console.log(tabId);
        	sendAMessage(tabId, type, msg);
        });
    }
});

//  Sends Message to Content.js
async function sendAMessage(tabId, type, msg) {
    chrome.tabs.sendMessage(tabId, {type: type, message: msg}, (response) => {
        console.log("Response: " + response.status);
    });
}

// Gets active tab ID int
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}
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
        const type = "useSelected";
		const parsed = parseJson(msg);
        sendAMessage(tab.id, type, parsed);
    }else if ('useClipboard' === info.menuItemId ) {
        const msg = "getClipboard();"
        const type = info.menuItemId;
        console.log(msg);
        // const parsed = parseJson(msg);
        sendAMessage(tab.id, type, msg);
    }
});

//  Sends Message to Content.js
async function sendAMessage(tabId, type, msg) {
    chrome.tabs.sendMessage(tabId, {type: type, message: msg}, (response) => {
        console.log("Response: " + response.status);
    });
};


function parseJson(message) {
    try {
        const obj = JSON.parse(message);
        var array = obj._source; 
		return array;
    } catch (e) {
		const error = 'Invalid JSON: ' + e;
        console.log(error);
		return error;
    }
};

// function getClipboard() {
//     navigator.clipboard.readText().then( clipText => {
//         return clipText;}
//     );
// };
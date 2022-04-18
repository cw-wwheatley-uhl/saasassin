// import {Record} from './record.js';
importScripts('record.js');

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
    handleEvent(info, tab);
});

async function handleEvent(info, tab){
    if ( 'useSelected'  === info.menuItemId ) {
        const record = new Record(info.selectionText);
         console.log(record.readBlob());
    }else if ('useClipboard' === info.menuItemId ) {
        const msg = "getClipboard();"
        const type = info.menuItemId;
        connectToTab(tab.id, type, msg);
    }
}

function connectToTab(tabId, type, msg) {
    const port = chrome.tabs.connect(tabId, {name: "contentTab"});
    port.postMessage({type: type, message: msg});
    port.onMessage.addListener( (msg) => {
        if(msg.data) {
            const record = new Record(msg.data);
            console.log(record.readBlob());

        //     TODO - Place result in view of user
        //     chrome.tabs.create({'url':'./popup.html'});
        //     chrome.runtime.sendMessage({type: "result", msg: record.readBlob()}, (response) => {
        //         console.log(response);
        //     });
        }
    });
}
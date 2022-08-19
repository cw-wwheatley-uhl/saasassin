// import {Record} from './record.js';
importScripts('record.js', 'response.js');

// Create Context Menus
chrome.runtime.onInstalled.addListener( () => {
    chrome.contextMenus.create({
        id: "main",
        title: "SaaSassin",
        contexts:["all"]
    });
    chrome.contextMenus.create({
        id: "useSelected",
        parentId: "main",
        title: "Use Selected Text...",
        contexts: ["selection"]
    });
    chrome.contextMenus.create({
        id: "useClipboard",
        parentId: "main",
        title: "Use Clipboard text...",
        contexts: ["page", "selection"]
    });
});

// listens for Context Menu Click
chrome.contextMenus.onClicked.addListener( (info,tab) => {
    handleEvent(info, tab);
});

// Process inbound context menu click events
async function handleEvent(info, tab){
    if ( 'useSelected'  === info.menuItemId ) {
        const record = new Record(info.selectionText);
        const response = new Response(record);
            response.parseRecord().then( (response) => {
                connectToTab(tab.id, "writeClipboard", response);
            })
        // record.readBlob().then( (response) => {
        //     connectToTab(tab.id, "writeClipboard", response);
        // });
        //  connectToTab(tab.id, "writeClipboard", response);
    }else if ('useClipboard' === info.menuItemId ) {
        const msg = "getClipboard();"
        const type = info.menuItemId;
        connectToTab(tab.id, type, msg);
    }
}

// Connect to tab calling extension, returning clibpoard data
async function connectToTab(tabId, type, msg) {
    const port = chrome.tabs.connect(tabId, {name: "contentTab"});
    port.postMessage({type: type, message: msg});
    
    port.onMessage.addListener( (msg) => {
        if(msg.type === 'rawClip') {
            const record = new Record(msg.data);
            const response = new Response(record);
            response.parseRecord().then( (response) => {
                port.postMessage({type: "writeClipboard", message: response});
            })
        }
        //     TODO - Place result in view of use
    });
}
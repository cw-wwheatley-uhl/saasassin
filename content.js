chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        // console.log("this " + request.message);
        if ('useSelected' === request.type ) {
            console.log("Type: " + request.type);
            console.log(request.message);
            sendResponse({ status: "done" });
        }
});

chrome.runtime.onConnect.addListener( (port) => {
    port.onMessage.addListener( (msg) => {
            if (msg.type === 'useClipboard') {
                getClipboard().then( (clipData) => {
                    port.postMessage({type: 'rawClip', data: clipData});
                });
            }else if (msg.type === 'writeClipboard'){
                writeClipboard(msg.data);
            };
    });
});

async function getClipboard() {
    try {
    const text = await navigator.clipboard.readText();
    return text; 
    } catch (err) {
        console.log("Failed to read clipboard: ", err);
    }
};

async function writeClipboard(data) {
    try {
        await navigator.clipboard.writeText(data);
    } catch(err) {
        console.error('Failed to write Clipboard', err);
    }
};
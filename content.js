// Listen for messages via port connected to tab.
chrome.runtime.onConnect.addListener( (port) => {
    port.onMessage.addListener( (msg) => {
            if (msg.type === 'useClipboard') {
                getClipboard().then( (clipData) => {
                    port.postMessage({type: 'rawClip', data: clipData});
                });
            }else if (msg.type === 'writeClipboard'){
                writeClipboard(msg.message);
                
            };
    });
});

// Get data from Clipboard
async function getClipboard() {
    try {
    const text = await navigator.clipboard.readText();
    return text; 
    } catch (err) {
        console.error("Failed to read clipboard: ", err);
    }
};

// Write processed data to clipboard.
async function writeClipboard(data) {
    try {
        await navigator.clipboard.writeText(data);
    } catch(err) {
        console.error('Failed to write Clipboard', err);
    }
};
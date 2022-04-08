chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        // console.log("this " + request.message);
        if ('useSelected' === request.type ) {
            console.log("Type: " + request.type);
            console.log(request.message);
            sendResponse({ status: "done" });
        }
        // }else if ('useClipboard' === request.type) {
        //     console.log("Type: " + request.type);
        //     console.log(request.message);
        //     const clipData = getClipboard();
        //     console.log(clipData);
        //     sendResponse( {status: "done"} );
        // }
});

chrome.runtime.onConnect.addListener( (port) => {
    port.onMessage.addListener( (msg) => {
        if (port.name === 'contentTab'){
            console.log(msg.message);
            getClipboard().then( (clipData) => {
                port.postMessage({data: clipData});
            })
        }
    });
});

function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
        function () {
            console.log("yes");
        },
        function () {
            console.log("no");
        }
    )
};
async function getClipboard() {
    try {
    const text = await navigator.clipboard.readText();
    console.log(text);
    return text; 
    } catch (err) {
        console.log("Failed to read clipboard: ", err);
    }
};
chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
        // console.log("this " + request.message);
        if ('useSelected' === request.type ) {
            console.log("Type: " + request.type);
            console.log(request.message);
            sendResponse({ status: "done" });
        }else if ('useClipboard' === request.type) {
            console.log("Type: " + request.type);
            console.log(request.message);
            const clipData = getClipboard();
            console.log(clipData);
            sendResponse({ status: "done"});
        }
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
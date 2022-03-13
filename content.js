chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log("this " + request.message);
        parseJson(request.message);
        sendResponse({ status: "done" });
});

function copyToClipboard(text) {
        navigator.clipboard.writeText(request.message).then(
        function () {
            console.log("yes");
        },
        function () {
            console.log("no");
        }
    );
};

function parseJson(message) {
    const obj = JSON.parse(message);
    // console.log(obj._source.additionalInfo);
    var additional = obj._source.additionalInfo;
    var array = additional.replace(/\[|\]/g, "");
    console.log(array);
};
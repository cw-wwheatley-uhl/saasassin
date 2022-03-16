chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log("this " + request.message);
        console.log("Type: " + request.type)
        let parsed = parseJson(request.message);
        // copyToClipboard(parsed);
        sendResponse({ status: "done" });
});

function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(
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
    // console.log(array);
    return array;
};
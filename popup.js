console.log("loaded");
browser.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if (request.type === 'result') {
        const result = document.getElementById('textResult');
        result.innerHTML = request.msg;
        sendResponse({response: "done"});
    }
})
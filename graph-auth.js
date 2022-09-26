// import * as msal from  "https://alcdn.msauth.net/browser/2.28.1/js/msal-browser.min.js";


async function butt(){
    var request = {
        scopes: ["Mail.Read"]
    };

    msalInstance.acquireTokenSilent(request).then(tokenResponse => {
        // Do something with the tokenResponse
    }).catch(async (error) => {
        if (error instanceof InteractionRequiredAuthError) {
            // fallback to interaction when silent call fails
            return msalInstance.acquireTokenPopup(request);
        }
    }).catch(error => {
        handleError(error);
    });
}
class Record {
    constructor(jsonBlob) {
        this.jsonBlob = jsonBlob;
        this.parsed = this.parseJson(this.jsonBlob)._source;
    }

    parseJson(blob) {
        try {
            const obj = JSON.parse(blob);
            return obj;
        } catch (e) {
            const error = 'Invalid JSON: ' + e;
            console.log(error);
            return error;
        }
    };

    readBlob() {
        let response = "";
        if(this.parsed.riskType === 'unlikelyTravel') {
            const additionalInfo = this.parsed.additionalInfo;
            const extraParsed = this.parseJson(additionalInfo.replace(/^\[|\]$|\"Key\"\:|\,\"Value\"/g, '').replace(/\},\{/g, ','));

            response += ("User Mailbox: " + this.parsed.userPrincipalName + 
                "\nCurrent Sign In IP: " + this.parsed.ipAddress + 
                "\nTime: " + this.parsed.timestamp +
                "\nGeo Location" +
                "\nPrevious Sign in IP: " + extraParsed.relatedLocation.clientIP + 
                "\nTime: " + extraParsed.relatedEventTimeInUtc);
        
        }else if(this.parsed.title === 'Atypical travel'){
            response += ("User Principal Name: " + this.parsed.userStates[0].userPrincipalName + 
                "\nCurrent Sign In IP: " + this.parsed.userStates[0].logonIp + 
                "\nTime: " + this.parsed.userStates[0].logonDateTime +
                "\nGeo Location:\n" +
                "\nPrevious Sign in IP: " + this.parsed.userStates[1].logonIp + 
                "\nTime: " + this.parsed.userStates[1].logonDateTime);
        }else if( this.parsed.Operation === 'Delete application password for user.') {
            response += ("Target: " + this.parsed.Target[3].ID +
                "\nActor: " + this.parsed.Actor[0].ID + 
                "\nTimestamp: " + this.parsed.perch_ingestion_timestamp );
        }else if(this.parsed.DetectionMethod === 'Antimalware protection') {
            response += `Recipient: ${this.parsed.Recipients[0]}
Sender: ${this.parsed.P2Sender}
Sender IP: ${this.parsed.SenderIp}
Internet Message ID: ${this.parsed.InternetMessageId}
Subject: ${this.parsed.Subject}
Attachment: ${this.parsed.AttachmentData[0].FileName}
Hash: ${this.parsed.AttachmentData[0].SHA256}`
        }
        return response;
    }
}
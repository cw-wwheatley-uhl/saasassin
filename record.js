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

    async readBlob() {
        let response = "";
        let result = "";
        
        const additionalInfo = this.parsed.additionalInfo;
        const extraParsed = this.parseJson(additionalInfo.replace(/^\[|\]$|\"Key\"\:|\,\"Value\"/g, '').replace(/\},\{/g, ','));
        
        if(this.parsed.riskType === 'unlikelyTravel') {
            
            const ipAddr1 = await this.geoIPLookup(this.parsed.ipAddress);
            const ipAddr2 = await this.geoIPLookup(extraParsed.relatedLocation.clientIP);
            result += await this.geoIPLookup("hello");
            response += ("User Mailbox: " + this.parsed.userPrincipalName + 
                "\nCurrent Sign In IP: " + this.parsed.ipAddress + 
                "\nTime: " + this.parsed.timestamp +
                "\nGeo Location: " + ipAddr1 +
                "\nPrevious Sign in IP: " + extraParsed.relatedLocation.clientIP + 
                "\nTime: " + extraParsed.relatedEventTimeInUtc) +
                "\nGeo Location: " + ipAddr2;
        
        }else if(this.parsed.title === 'Atypical travel'){
            const ipAddr1 = await this.geoIPLookup(this.parsed.ipAddress);
            const ipAddr2 = await this.geoIPLookup(extraParsed.relatedLocation.clientIP);
            response += ("User Principal Name: " + this.parsed.userStates[0].userPrincipalName + 
                "\nCurrent Sign In IP: " + this.parsed.userStates[0].logonIp + 
                "\nTime: " + this.parsed.userStates[0].logonDateTime +
                "\nGeo Location: " + this.geoIP(this.parsed.userStates[0].logonIp) +
                "\nPrevious Sign in IP: " + this.parsed.userStates[1].logonIp + 
                "\nTime: " + this.parsed.userStates[1].logonDateTime +
                "\nGeo Location: " + this.geoIP(this.parsed.userStates[1].logonIp));
        }else if( this.parsed.Operation === 'Delete application password for user.') {
            response += ("Target: " + this.parsed.Target[3].ID +
                "\nActor: " + this.parsed.Actor[0].ID + 
                "\nTimestamp: " + this.parsed.perch_ingestion_timestamp );
        }else if(this.parsed.DetectionMethod === 'Antimalware protection') {
            const ipAddr1 = await this.geoIPLookup(this.parsed.ipAddress);
            const ipAddr2 = await this.geoIPLookup(extraParsed.relatedLocation.clientIP);
            response += `Recipient: ${this.parsed.Recipients[0]}\nSender: ${this.parsed.P2Sender}\nSender IP: ${this.parsed.SenderIp}\nInternet Message ID: ${this.parsed.InternetMessageId}\nSubject: ${this.parsed.Subject}\nAttachment: ${this.parsed.AttachmentData[0].FileName}\nHash: ${this.parsed.AttachmentData[0].SHA256}`
        }
        return response;
    }

    async geoIPLookup(ipAddr) {
        let response = await fetch(`http://ip-api.com/json/${ipAddr}`);
        let data = await response.json();
        let result = `${data.city}, ${data.regionName}, ${data.country}`

        return result;
    }
}

class Response {
    constructor(recordJson) {
        this.record = recordJson;
    }

    async parseRecord() {
        let response = "";
        if(this.record.parsed.riskType === 'unlikelyTravel') {
            const geoLocale1 = await this.geoIPLookup(this.record.parsed.ipAddress);
            const geoLocale2 = await this.geoIPLookup(this.record.additionalInfo.relatedLocation.clientIP);

            response += ("User Mailbox: " + this.record.parsed.userPrincipalName + 
                "\nCurrent Sign In IP: " + this.record.parsed.ipAddress + 
                "\nTime: " + this.record.parsed.timestamp +
                "\nGeo Location: " + geoLocale1 +
                "\nPrevious Sign in IP: " + this.record.additionalInfo.relatedLocation.clientIP + 
                "\nTime: " + this.record.additionalInfo.relatedEventTimeInUtc) +
                "\nGeo Location: " + geoLocale2;
        
        }else if(this.record.parsed.title === 'Atypical travel'){
            const geoLocale1 = await this.geoIPLookup(this.record.parsed.userStates[0].logonIp);
            const geoLocale2 = await this.geoIPLookup(this.record.parsed.userStates[1].logonIp);

            response += ("User Principal Name: " + this.record.parsed.userStates[0].userPrincipalName + 
                "\nCurrent Sign In IP: " + this.record.parsed.userStates[0].logonIp + 
                "\nTime: " + this.record.parsed.userStates[0].logonDateTime +
                "\nGeo Location: " + geoLocale1 +
                "\nPrevious Sign in IP: " + this.record.parsed.userStates[1].logonIp + 
                "\nTime: " + this.record.parsed.userStates[1].logonDateTime +
                "\nGeo Location: " + geoLocale2);

        }else if( this.record.parsed.Operation === 'Delete application password for user.') {

            response += ("Target: " + this.record.parsed.Target[3].ID +
                "\nActor: " + this.record.parsed.Actor[0].ID + 
                "\nTimestamp: " + this.record.parsed.perch_ingestion_timestamp );

        }else if(this.record.parsed.DetectionMethod === 'Antimalware protection') {

            response += `Recipient: ${this.record.parsed.Recipients[0]}\nSender: ${this.record.parsed.P2Sender}\nSender IP: ${this.record.parsed.SenderIp}\nInternet Message ID: ${this.record.parsed.InternetMessageId}\nSubject: ${this.record.parsed.Subject}\nAttachment: ${this.record.parsed.AttachmentData[0].FileName}\nHash: ${this.record.parsed.AttachmentData[0].SHA256}`

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
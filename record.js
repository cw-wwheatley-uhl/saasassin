class Record {
    constructor(jsonBlob) {
        this.jsonBlob = jsonBlob;
        this.parsed = this.parseJson(this.jsonBlob)._source;
        
        // If the alert type is Unlikely Travel, need to "extra parse" the "additionalInfo" field.
        if(this.parsed.riskType === 'unlikelyTravel') {
            this.additionalInfo = this.parseJson(this.parsed.additionalInfo.replace(/^\[|\]$|\"Key\"\:|\,\"Value\"/g, '').replace(/\},\{/g, ','));
        }else if (this.parsed.AirData.AlertDisplayName === "A potentially malicious URL click was detected") {
            if(this.parsed.Status === "Investigation Started"){
                this.mailData = this.parsed.AirData.Entities[2];
            }else if(this.parsed.Status === "Running" || this.parsed.Status ==="Remediated"){
                this.mailData = this.parsed.AirData.Entities[0];
            }else {
                let x = 0;
                for(x in this.parsed.AirData.Entities){
                    if("Recipient" in this.parsed.AirData.Entities[x]){
                        break;
                    }
                }
                this.mailData = this.parsed.AirData.Entities[x];
            }
        }
        console.log(this.parsed)
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
   
}

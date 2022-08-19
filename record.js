class Record {
    constructor(jsonBlob) {
        this.jsonBlob = jsonBlob;
        this.parsed = this.parseJson(this.jsonBlob)._source;
        
        // If the alert type is Unlikely Travel, need to "extra parse" the "additionalInfo" field.
        if(this.parsed.riskType === 'unlikelyTravel') {
            this.additionalInfo = this.parseJson(this.parsed.additionalInfo.replace(/^\[|\]$|\"Key\"\:|\,\"Value\"/g, '').replace(/\},\{/g, ','));
        }
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

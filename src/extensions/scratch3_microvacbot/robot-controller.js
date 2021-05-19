class RobotController {

    constructor() {

		this._lastResponse = null;
    }

    setJsonrpcUrl(url) {
        this.url = url;
        
        return this;
    }

    post(command, params){

        if(!this.url) {
        	const messageError = "Microvacbot: The JSON-RPC URL is not set yet!";
        	console.error(messageError);
        	throw messageError;
        }
        
        this._waitingResponse = true;
        this._lastResponse = null;

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.withCredentials = false;
        
        xhr.onreadystatechange = function () {
            
            if (xhr.readyState === 4){
                
                if(xhr.status === 200) {
                
                    console.log(`response: '${xhr.responseText || ""}'`);
                    let json = JSON.parse(xhr.responseText);
                    this._lastResponse = json["result"];

                } else {
                    
                    console.error(xhr.statusText);
                }
                
                this._waitingResponse = false;
            }
        }.bind(this);
        
        var data = JSON.stringify({"method": command, "params": params || [], "id":0, "jsonrpc": "2.0"});
        console.log(`POST (${this.url}): "${data}"`);
        xhr.send(data);
        
 		return new Promise((resolve, reject) => setTimeout(()=>this._checkPostDone(resolve, reject), 0));       
    }

	_checkPostDone(resolve, reject){
	
		if (this._waitingResponse){
			setTimeout(()=>this._checkPostDone(resolve, reject), 0);
		}
		else{
			const response = this._lastResponse;
			if(response && response["success"] == "OK"){
				if(response["data"]){
					resolve(response["data"]);
				}else{
					resolve();
				}
			}else{
				reject("error on POST");
			}
		}
	}

    _sendMotionCommand(method, timeout, unit){
    
        timeout = timeout || 0;
        unit = unit || "s";
    
        this.post(method, [timeout, unit]);
    }

    forwards(timeout, unit){
    
        this._sendMotionCommand("forwards", timeout, unit);
    }

    turnLeft(timeout, unit){
    
        this._sendMotionCommand("turnLeft", timeout, unit);
    }

    stop(){
    
        this.post("stop");
    }
    
    turnRight(timeout, unit){
    
        this._sendMotionCommand("turnRight", timeout, unit);
    }
    
    backwards(timeout, unit){
    
        this._sendMotionCommand("backwards", timeout, unit);
    }
    
    displayExpression(idExp){
    
        return this.post("displayExpression", [idExp]);
    }
    
    beep(freq, millisec){
 
        this.post("beep", [freq, millisec]);        
    }
    
    turnTo(angle){
        this.post("turnTo", [angle, true]);
    }
    
    turn(angle){
        this.post("turn", [angle, true]);
    }
    
    forwardsTo(length){
        this.post("forwardsTo", [length]);
    }
    
    backwardsTo(length){
        this.post("backwardsTo", [length]);
    }

    wait(seconds){
        this.post("wait", [seconds]);
    }
    
    getDistance(){
    	return this.post("getDistance").then(data=>parseInt(data));
    }
};


module.exports = RobotController;

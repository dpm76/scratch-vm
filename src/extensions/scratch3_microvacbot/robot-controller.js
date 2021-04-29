class RobotController {

    constructor() {
		this._waitingResponse = false;
		this._free = true;
    }

    setJsonrpcUrl(url) {
        this.url = url;
        
        return this;
    }

    post(command, params, callback){

        if(this.url) {
        
        	this._waitingResponse = true;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.withCredentials = false;
            
            xhr.onreadystatechange = function () {
                
                if (xhr.readyState === 4){
                    
                    if(xhr.status === 200) {
                    
                        console.log(`response: '${xhr.responseText || ""}'`);
                        if(callback){
                            
                            var json = JSON.parse(xhr.responseText);
                            callback(json);
                        }
                    } else {
                        
                        console.error(xhr.statusText);
                    }
                    
                    this._waitingResponse = false;
                }
            }.bind(this);
            
            var data = JSON.stringify({"method": command, "params": params || [], "id":0, "jsonrpc": "2.0"});
            console.log(`POST (${this.url}): "${data}"`);
            xhr.send(data);
            
        } else {
            console.error("The JSON-RPC URL is not set yet!");
        }
    }

    _sendMotionCommand(method, timeout, unit){
    
        timeout = timeout || 0;
        unit = unit || "s";
    
        this.post(method, [timeout, unit]);
    }
    
    isWaitingResponse(){ return this._waitingResponse; }
    isFree(){ return this._free; }
    take(){ this._free = false; }
    release(){ this._free = true; }

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
    
        this.post("displayExpression", [idExp]);
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
};


module.exports = RobotController;

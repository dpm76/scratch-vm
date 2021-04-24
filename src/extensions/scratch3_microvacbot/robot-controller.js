class RobotController {

    constructor() {

    }

    setJsonrpcUrl(url) {
        this.url = url;
        
        return this;
    }

    post(command, params, callback){

        if(this.url) {

            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.withCredentials = false;
            
            xhr.onreadystatechange = function () {
                
                if (xhr.readyState === 4){
                    
                    if(xhr.status === 200) {
                        if(callback){
                            var json = JSON.parse(xhr.responseText);
                            callback(json);
                        }
                    } else {
                        
                        console.error(xhr.statusText);
                    }
                }
            };
            
            var data = JSON.stringify({"method": command, "params": params || [], "id":0, "jsonrpc": "2.0"});
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
};


module.exports = RobotController;

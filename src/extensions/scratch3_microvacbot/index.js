const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const RobotController = require('./robot-controller');

// Time to send messages
const sendTime = 100; //ms
const turnWaitTime = 3000; //ms
const goToWaitTime = 200; //ms/unit

class Scratch3Microvacbot {
    
    static get EXTENSION_ID () {
        return 'microvacbot';
    }
    
    constructor (runtime) {
    
        this.runtime = runtime;
        
        this._controller = new RobotController().setJsonrpcUrl('http://localhost:4000/jsonrpc');
        
    }

    getInfo () {
        return {
            id: 'microvacbot',
            name: 'Microvacbot',
            blocks: [
                {
                    opcode: 'forwards',
                    blockType: BlockType.COMMAND,
                    text: 'go forwards'
                },
                {
                    opcode: 'backwards',
                    blockType: BlockType.COMMAND,
                    text: 'go backwards'
                },
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: 'stop'
                },
                {
                    opcode: 'turnRight',
                    blockType: BlockType.COMMAND,
                    text: 'turn right'
                },
                {
                    opcode: 'turnLeft',
                    blockType: BlockType.COMMAND,
                    text: 'turn left'
                },
                {
                    opcode: 'displayExpression',
                    blockType: BlockType.COMMAND,
                    text: 'display expression [ID_EXP]',
                    arguments: {
                        ID_EXP: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'beep',
                    blockType: BlockType.COMMAND,
                    text: 'beep at [FREQ] Hz during [MILLISEC] milliseconds',
                    arguments: {
                        FREQ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 440
                        },
                        MILLISEC: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                },
                {
                    opcode: 'playNote',
                    blockType: BlockType.COMMAND,
                    text: 'play [NOTE] as [DURATION] [DOT]',
                    arguments: {
                        NOTE: {
                            type: ArgumentType.NOTE,
                            defaultValue: 48
                        },
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            menu: 'NOTE_DURATION_MENU',
                            defaultValue: 250
                        },
                        DOT:{
                            type: ArgumentType.NUMBER,
                            menu: 'NOTE_DOTTED_MENU',
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'forwardsDuring',
                    blockType: BlockType.COMMAND,
                    text: "go forwards during [DURATION] [TIME_UNIT]",
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        TIME_UNIT: {
                            type: ArgumentType.STRING,
                            defaultValue: "s",
                            menu: "TIME_UNIT_MENU"
                        }
                    }
                },
                {
                    opcode: 'backwardsDuring',
                    blockType: BlockType.COMMAND,
                    text: "go backwards during [DURATION] [TIME_UNIT]",
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3
                        },
                        TIME_UNIT: {
                            type: ArgumentType.STRING,
                            defaultValue: "s",
                            menu: "TIME_UNIT_MENU"
                        }
                    }
                },
                {
                    opcode: 'turnLeftDuring',
                    blockType: BlockType.COMMAND,
                    text: "turn left during [DURATION] [TIME_UNIT]",
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        },
                        TIME_UNIT: {
                            type: ArgumentType.STRING,
                            defaultValue: "ms",
                            menu: "TIME_UNIT_MENU"
                        }
                    }
                },
                {
                    opcode: 'turnRightDuring',
                    blockType: BlockType.COMMAND,
                    text: "turn right during [DURATION] [TIME_UNIT]",
                    arguments: {
                        DURATION: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        },
                        TIME_UNIT: {
                            type: ArgumentType.STRING,
                            defaultValue: "ms",
                            menu: "TIME_UNIT_MENU"
                        }
                    }
                },
                {
                    opcode: 'turnTo',
                    blockType: BlockType.COMMAND,
                    text: "turn to [ANGLE] degrees",
                    arguments: {
                        ANGLE : {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        }
                    }
                },
                {
                    opcode: 'turn',
                    blockType: BlockType.COMMAND,
                    text: "turn [ANGLE] degrees",
                    arguments: {
                        ANGLE : {
                            type: ArgumentType.ANGLE,
                            defaultValue: 0,
                        }
                    }
                },
                {
                    opcode: 'forwardsTo',
                    blockType: BlockType.COMMAND,
                    text: "go forwards [LENGTH] units",
                    arguments: {
                        LENGTH : {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            allowNegative: false,
                        }
                    }
                },
                {
                    opcode: 'backwardsTo',
                    blockType: BlockType.COMMAND,
                    text: "go backwards [LENGTH] units",
                    arguments: {
                        LENGTH : {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                        }
                    }
                },
                {
                    opcode: 'wait',
                    blockType: BlockType.COMMAND,
                    text: "wait [SECONDS] seconds",
                    arguments: {
                        SECONDS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                NOTE_DURATION_MENU: {
                    acceptReporters: true,
                    items: [
                        { text: "round", value: 1000 },
                        { text: "white", value: 500 },                        
                        { text: "black", value: 250 },
                        { text: "eighth", value: 125 },
                        { text: "sixteenth", value: 62 }
                    ]
                },
                NOTE_DOTTED_MENU: {
                    acceptReporters: true,
                    items: [
                        { text: "", value: 0 },
                        { text: "dot", value: 1 }
                    ]
                },
                TIME_UNIT_MENU: {
                    acceptReporters: true,
                    items: [
                        { text: "seconds", value: "s" },
                        { text: "milliseconds", value: "ms" }
                    ]
                }
            }
        };
    }
    
    _doBlockAction(blockAction){
    
        blockAction();
        return new Promise(resolve => setTimeout(resolve, sendTime));
    }
    
    _doBlockActionDuring(blockAction, duration, unit){
    
        blockAction();
        let timeout = (unit == "ms")? duration : (duration * 1000);
        return new Promise(resolve => setTimeout(resolve, 1000 + timeout)); // 1 second more to be sure the last action is done
    }
    
    forwards(){ return this._doBlockAction(() => this._controller.forwards()); }
    
    forwardsDuring(args){
    
        let duration = Cast.toNumber(args.DURATION);
        let unit = Cast.toString(args.TIME_UNIT);
        return this._doBlockActionDuring(() => this._controller.forwards(duration, unit), duration, unit);
        
    }
    
    backwards(){ return this._doBlockAction(() => this._controller.backwards()); }
    
    backwardsDuring(args){
    
        let duration = Cast.toNumber(args.DURATION);
        let unit = Cast.toString(args.TIME_UNIT);
        return this._doBlockActionDuring(() => this._controller.backwards(duration, unit), duration, unit);
        
    }

    stop(){ return this._doBlockAction(() => this._controller.stop()); }

    turnLeft(){ return this._doBlockAction(() => this._controller.turnLeft()); }
    
    turnLeftDuring(args){
    
        let duration = Cast.toNumber(args.DURATION);
        let unit = Cast.toString(args.TIME_UNIT);
        return this._doBlockActionDuring(() => this._controller.turnLeft(duration, unit), duration, unit);
        
    }

    turnRight(){ return this._doBlockAction(() => this._controller.turnRight()); }
    
    turnRightDuring(args){
    
        let duration = Cast.toNumber(args.DURATION);
        let unit = Cast.toString(args.TIME_UNIT);
        return this._doBlockActionDuring(() => this._controller.turnRight(duration, unit), duration, unit);
        
    }
    
    displayExpression(args){ 
    
        let idExp = Cast.toNumber(args.ID_EXP);
        return this._doBlockAction(() => this._controller.displayExpression(idExp));
        
    }
    
    _beep(freq, beepTime){
    
        this._controller.beep(freq, beepTime);
        return new Promise(resolve => setTimeout(resolve, beepTime));
    }
    
    beep(args){ 
    
        let beepTime = Cast.toNumber(args.MILLISEC);
        let freq = Cast.toNumber(args.FREQ);
        return this._beep(freq, beepTime);        
    }
    
    playNote(args){
    
        let note = Cast.toNumber(args.NOTE);
        let duration = Cast.toNumber(args.DURATION);
        let dot = Cast.toBoolean(args.DOT);
        
        let freq = Math.round(440 * Math.pow(2, (note-57)/12));
        let beepTime = Math.round(duration + (dot? duration / 2 : 0));
        return this._beep(freq, beepTime);
    }
    
    turnTo(args){
    
        let angle = Cast.toNumber(args.ANGLE);
        if(angle < 0){
            angle = 360 + angle;
        }
        return this._doBlockActionDuring(() => this._controller.turnTo(angle), turnWaitTime, "ms");
    }
    
    turn(args){
    
        let angle = Cast.toNumber(args.ANGLE);
        return this._doBlockActionDuring(() => this._controller.turn(angle), turnWaitTime, "ms");
    }
    
    forwardsTo(args){
    
        let length = Cast.toNumber(args.LENGTH);
        return this._doBlockActionDuring(() => this._controller.forwardsTo(length), goToWaitTime*length, "ms");
    }
    
    backwardsTo(args){
    
        let length = Cast.toNumber(args.LENGTH);
        return this._doBlockActionDuring(() => this._controller.backwardsTo(length), goToWaitTime*length, "ms");
    }

    wait(args){

        let seconds = Cast.toNumber(args.SECONDS);
        this._controller.wait(seconds);
    }
}

module.exports = Scratch3Microvacbot;

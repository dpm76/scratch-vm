const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const RobotController = require('./robot-controller');


const ObstacleSensorMenuChoices = {
	any: "ANY",
	left: "LEFT",
	right: "RIGHT"
};

class Scratch3Microvacbot {
    
    static get EXTENSION_ID () { return 'microvacbot'; }
        
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
                },
                {
                	opcode: 'getDistance',
                	blockType: BlockType.REPORTER,
                	text: "distance"
                },
                {
                	opcode: 'isObstacle',
                	blockType: BlockType.BOOLEAN,
                	text: "obstacle? [OBSTACLE_SENSOR]",
                	arguments: {
                		OBSTACLE_SENSOR: {
                			type: ArgumentType.STRING,
                			menu: "OBSTACLE_SENSOR_MENU",
                			defaultValue: ObstacleSensorMenuChoices.any
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
                },
                OBSTACLE_SENSOR_MENU: {
                	acceptReporters: true,
                	items: [
                		{ text: "any", value: ObstacleSensorMenuChoices.any },
                		{ text: "left", value: ObstacleSensorMenuChoices.left },
                		{ text: "right", value: ObstacleSensorMenuChoices.right }
                	]
                }
            }
        };
    }
        
    forwards(args){ return this._controller.forwards(); }
    
    backwards(args){ return this._controller.backwards(); }
    
    stop(args){ return this._controller.stop(); }

    turnLeft(args){ return this._controller.turnLeft(); }
    
    turnRight(args){ return this._controller.turnRight(); }
    
    displayExpression(args){ return this._controller.displayExpression(Cast.toNumber(args.ID_EXP)); }
    
    beep(args){ return this._controller.beep(Cast.toNumber(args.FREQ), Cast.toNumber(args.MILLISEC)); }
    
    playNote(args){
    
        let note = Cast.toNumber(args.NOTE);
        let duration = Cast.toNumber(args.DURATION);
        let dot = Cast.toBoolean(args.DOT);
        
        let freq = Math.round(440 * Math.pow(2, (note-57)/12));
        let beepTime = Math.round(duration + (dot? duration / 2 : 0));

        return this._controller.beep(freq, beepTime);
    }
    
    turnTo(args){
    
        let angle = Cast.toNumber(args.ANGLE);
        if(angle < 0){
            angle = 360 + angle;
        }
        return this._controller.turnTo(angle);
    }
    
    turn(args){ return this._controller.turn(Cast.toNumber(args.ANGLE)); }
    
    forwardsTo(args){ return this._controller.forwardsTo(Cast.toNumber(args.LENGTH)); }
    
    backwardsTo(args){ return this._controller.backwardsTo(Cast.toNumber(args.LENGTH)); }

    wait(args){ return this._controller.wait(Cast.toNumber(args.SECONDS)); }
    
    getDistance(args){ return this._controller.getDistance(); }
    
    //TODO: 20210519 DPM - Implement optical obstacle detection on Microvacbot's controller (aka. RobotController)
    isObstacle(arg){ return Promise.resolve(Math.random() >= 0.5); }
}

module.exports = Scratch3Microvacbot;

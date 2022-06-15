import { Vector3 } from "@math.gl/core";
import DisplayEntity from "./entities/DisplayEntity";

type GameControllerDisplay = "life" | "ammunition";
type GameControllerAttributes = {
    display: DisplayEntity,
    value: number
}
class GameController {

    private static _life: GameControllerAttributes;
    private static _ammunition: GameControllerAttributes;


    static setDisplay(name: GameControllerDisplay, display: DisplayEntity, color : Vector3) {
        this["_"+name] = { display, value: 100 };
        display.setText(String(100), color);
    }

    static isAmmunition() : boolean{
        return this.ammunition != 0;
    }

    static isLife() : boolean{
        return this.life != 0;
    }

    static get life(){
        return this._life.value;
    } 
    
    static get ammunition(){
        return this._ammunition.value;
    } 

    static update(name : GameControllerDisplay, value : number) {
        const attribute = this["_"+name];
        attribute.value += value;
        if(attribute.value < 0) attribute.value = 0;
        this["_"+name] = attribute;
        attribute.display.updateText(attribute.value);
        if(name == "life" && attribute.value == 0){
            alert("Game Over");
        }
    }
}

export default GameController;
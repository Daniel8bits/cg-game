import { Vector3 } from "@math.gl/core";
import InputManager, { Keys } from "@razor/core/InputManager";
import Razor from "@razor/core/Razor";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import Renderer from "../../../../engine/renderer/Renderer";
import GuiEntity from "./GuiEntity";
import OptionEntity from "./OptionEntity";

class SelectEntity extends GuiEntity {

    private padding :number = 0;
    private options : OptionEntity[] = [];
    private selected : number = 0;
    private change : boolean = false;

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
    }
    
    
    public addOption(text: string): OptionEntity {
        const name = text.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
        const entity = new OptionEntity(this, this.getName()+"_"+name, this.getRenderer(),this.getScene())

        if(this.padding > 0) entity.selected(false);
        this.options.push(entity);
        entity.getTransform().setTranslation(new Vector3(0,70 * (this.padding++),0).negate());
        entity.setText(text);
        entity.getTransform().parent = this.getTransform();
        this.getScene().add(entity);
        this.updateTranslation();
        return entity;
    }

    public updateTranslation(width : number = Razor.CANVAS.width,height : number = Razor.CANVAS.height){
        const top = height/2 - 50/2 - (70 * this.padding)/2;
        const left = width/2 - 180/2;
        this.getTransform().setTranslation(new Vector3(left,top,0).negate())
    }

    
    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {
        const keyDown = InputManager.isKeyPressedDown(Keys.KEY_DOWN);
        const keyUp = InputManager.isKeyPressedDown(Keys.KEY_UP);
        if(keyDown || keyUp){
            if(this.change){
                let next: number;
                const prev = this.selected;
                if(keyUp){
                    next = prev - 1;
                    if(next < 0) next = this.options.length-1;
                }else{
                    next = prev + 1;
                    if(next >= this.options.length) next = 0;
                }
                ResourceManager.getSound("menu").play();
                this.options[prev].selected(false);
                this.options[next].selected(true);
                this.selected = next;
                this.change = false;
            }
        }else 
        if(InputManager.isKeyPressedDown(Keys.KEY_ENTER)){
            if(this.change){
                this.options[this.selected].execute();
            }
        }else{
            this.change = true;
        }
    }
}

export default SelectEntity
import { Matrix4, Vector2, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import InputManager, { Keys } from "@razor/core/InputManager";
import Razor from "@razor/core/Razor";
import Scene from "@razor/core/scenes/Scene";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Transform from "@razor/math/Transform";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";
import OptionEntity from "./OptionEntity";

class SelectEntity extends GuiEntity {

    private padding :number = 0;
    private options : OptionEntity[] = [];
    private selected : number = 0;
    private change : boolean = false;
    public constructor(name: string, renderer: Renderer,scene : Scene) {
        super(name, renderer);
        this.setScene(scene);
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

    private updateTranslation(){
        const top = Razor.CANVAS.height/2 - 50/2 - (70 * this.padding)/2;
        const left = Razor.CANVAS.width/2 - 180/2;
        this.getTransform().setTranslation(new Vector3(left,top,0).negate())
    }

    
    public update(time: number, delta: number): void {
        const keyDown = InputManager.isKeyPressed(Keys.KEY_DOWN);
        const keyUp = InputManager.isKeyPressed(Keys.KEY_UP);
        if(keyDown || keyUp){
            if(this.change){
                let next;
                const prev = this.selected;
                if(keyUp){
                    next = prev - 1;
                    if(next < 0) next = this.options.length-1;
                }else{
                    next = prev + 1;
                    if(next >= this.options.length) next = 0;
                }
                this.options[prev].selected(false);
                this.options[next].selected(true);
                this.selected = next;
                this.change = false;
            }
        }else 
        if(InputManager.isKeyPressed(Keys.KEY_ENTER)){
            if(this.change){
                this.options[this.selected].execute();
            }
        }else{
            this.change = true;
        }
    }
}

export default SelectEntity
import { Matrix4, Vector2, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Scene from "@razor/core/scenes/Scene";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";
import RectangleEntity from "./RectangleEntity";
import SelectEntity from "./SelectEntity";
import TextEntity from "./TextEntity";

class OptionEntity extends GuiEntity {
    private size: Vector2;


    private text : TextEntity;
    private selection : RectangleEntity;
    private rect : RectangleEntity;
    private callback : () => any = null;

    public constructor(select : SelectEntity,name: string, renderer: Renderer,scene : Scene) {
        super(name, renderer);
        this.getTransform().parent = select;
        this.setScene(scene);
        
        this.selection = this.addRectangle(this.getName()+"_option_selection");
        this.selection.setSize(190,60)
        this.selection.color = new Vector3(1,1,1)
        this.selection.getTransform().setTranslation(new Vector3(5,5,1));

        this.rect = this.addRectangle(this.getName()+"_option_rectangle");
        this.rect.getTransform().setTranslation(new Vector3(0,0,1));
        this.rect.setSize(180,50)
        this.text = this.addText(this.getName()+"_option_text");
        this.text.getTransform().setTranslation(new Vector3(-15,-15,-1))
        this.text.getTransform().setScale(new Vector3(2,2,2))
        ///this.rect.getTransform().parent = this;
        //this.text.getTransform().parent = this;
    }

    public selected(visible : boolean){
        this.getScene().setVisibility(this.selection,visible);
    }

    public getRect() : RectangleEntity{
        return this.rect;
    }

    public setText(text : string){
        this.text.setText(text);
    }

    public setExecute(callback: () => any){
        this.callback = callback;
    }

    public execute() : any{
        if(this.callback == null) return;
        return this.callback();
    }

    
    public update(time: number, delta: number): void {

    }
}

export default OptionEntity
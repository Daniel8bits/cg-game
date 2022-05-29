import { Matrix4, Vector3 } from "@math.gl/core";
import DefaultMaterial from "@razor/appearance/material/DefaultMaterial";
import VBO from "@razor/buffer/VBO";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import TextureLoader from "@razor/loader/TextureLoader";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";
import RectangleEntity from "./RectangleEntity";
import TextEntity from "./TextEntity";

class DialogEntity extends GuiEntity {

    private _text : TextEntity;
    private _rectangle : RectangleEntity;
    private paddingTop = 5;
    private paddingLeft = 5;

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
    }
    
    public init(color : Vector3 = new Vector3(0.9,0.9,0.9)) : void {
        this._rectangle = this.addRectangle(this.getName()+"_rectangle_left");
        this._rectangle.color = color;
        this._rectangle.getTransform().parent = this;
        this._text = this.addText(this.getName()+"_text_rectangle_left");
        this._text.setText("")
        this._text.getTransform().setTranslation(new Vector3(this.paddingLeft, this.paddingTop, 1).negate())
        this._text.getTransform().setScale(new Vector3(2, 2, 2))
    }
    
    public setImage(image ){
        image.getTransform().setTranslation(new Vector3(0,0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09,0.09, 1));
        this.getScene().add(image);
        image.getTransform().parent = this;
    }
    
    public updateText(name : string){
        this._text.setText(name);
        const length = name.toLowerCase().replace(/ /g, '').replace(/[^\w-]+/g, '').length;
        console.log(name.length,length)
        const diff = Math.abs(name.length - length)-2;
        this._rectangle.setSize(8 * 2  * length + this.paddingLeft * 2 + 8 * diff,8 * 2 + this.paddingTop * 2);
    }

    public animateText(name: string,wordPerSeconds=  1){
        let i = 1;
        const length = name.length;
        const intervalText = setInterval(() => {
            if(i == length){
                clearInterval(intervalText)
            }
            this.updateText(name.slice(0,i++));
        },1/wordPerSeconds * 1000);
    }

    public update(time: number, delta: number): void {

    }
}

export default DialogEntity
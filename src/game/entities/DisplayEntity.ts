import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Renderer from "@razor/renderer/Renderer";
import GuiEntity from "./gui/GuiEntity";
import TextEntity from "./gui/TextEntity";


class DisplayEntity extends GuiEntity {

    private _text : TextEntity;

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
    }
    
    public setText(name: string,color : Vector3 = new Vector3(0.9,0.9,0.9)) : void {
        const rectangle = this.addRectangle(this.getName()+"_rectangle_left");
        rectangle.color = color;
        rectangle.setSize(120, 50);
        rectangle.getTransform().parent = this;
        const text = this.addText(this.getName()+"_text_rectangle_left");
        text.setText(name)
        text.getTransform().setTranslation(new Vector3(50, 15, 1).negate())
        text.getTransform().setScale(new Vector3(2, 2, 2))
    }

    public setImage(image ){
        image.getTransform().setTranslation(new Vector3(0,0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09,0.09, 1));
        this.getScene().add(image);
        image.getTransform().parent = this;
    }

    public updateText(text : number){
        
        this._text.setText(String(text));
    }

    public update(time: number, delta: number): void {

    }
}

export default DisplayEntity
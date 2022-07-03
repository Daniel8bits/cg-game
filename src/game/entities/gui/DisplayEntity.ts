import { Vector3 } from "@math.gl/core";
import Entity from "@razor/core/entities/Entity";
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
import Renderer from "@razor/renderer/Renderer";
import GameTest from "src/game/GameTest";
import GuiEntity from "./common/GuiEntity";
import TextEntity from "./common/TextEntity";


class DisplayEntity extends GuiEntity {

    private _text : TextEntity;

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
    }
    
    public setText(name: string,color : Vector3 = new Vector3(0.9,0.9,0.9)) : void {
        const rectangle = this.addRectangle(this.getName()+"_rectangle_left");
        rectangle.color = color;
        rectangle.setSize(120, 50);
        rectangle.getTransform().parent = this.getTransform();
        const text = this.addText(this.getName()+"_text_rectangle_left");
        this._text = text;
        text.setText(name)
        text.getTransform().setTranslation(new Vector3(50, 15, 1).negate())
        text.getTransform().setScale(new Vector3(2, 2, 2))
    }

    public setImage(image: Entity){
        image.getTransform().setTranslation(new Vector3(0,0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09,0.09, 1));
        image.getTransform().parent = this.getTransform();
        this.getScene().add(image)
    }

    public updateText(text : string | number){
        
        this._text.setText(String(text));
    }

    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {

    }

    public exists(): boolean {
        return !!this._text
    }
}

export default DisplayEntity
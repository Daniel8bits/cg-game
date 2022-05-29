import { Vector3 } from "@math.gl/core";
import ResourceManager from "@razor/core/ResourceManager";
import Renderer from "@razor/renderer/Renderer";
import GuiEntity from "./gui/GuiEntity";
import TextEntity from "./gui/TextEntity";


class DisplayEntity extends GuiEntity {

    public constructor(name: string, renderer: Renderer) {
        super(name, renderer);
    }
    
    public setText(name: string) : void {
        const rectangle = this.addRectangle("rectangle_left");
        rectangle.color = new Vector3(1, 0, 0);
        rectangle.setSize(150, 50);
        rectangle.getTransform().parent = this;
        const text = this.addText("text_rectangle_left");
        text.setText("100")
        text.getTransform().setTranslation(new Vector3(50, 15, 1).negate())
        text.getTransform().setScale(new Vector3(2, 2, 2))
    }

    public setImage(image ){
        image.getTransform().setTranslation(new Vector3(0,0, 1).negate());
        image.getTransform().setScale(new Vector3(0.09,0.09, 1));
        this.getScene().add(image);
        image.getTransform().parent = this;
    }


    public update(time: number, delta: number): void {

    }
}

export default DisplayEntity
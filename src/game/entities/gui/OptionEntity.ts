import { Matrix4, Vector2, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Scene from "@razor/core/Scene";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";
import TextEntity from "./TextEntity";

class OptionEntity extends GuiEntity {
    private size: Vector2;

    private text : TextEntity;

    public constructor(name: string, renderer: Renderer,scene : Scene) {
        super(name, renderer);
        this.setScene(scene);
        this.size = new Vector2(0,0);
        const rect = this.addRectangle(name+"_option_rectangle");
        rect.setSize(180,50)
        this.text = this.addText(name+"_option_text");
        this.text.getTransform().setTranslation(new Vector3(-15,-15,-1))
        this.text.getTransform().setScale(new Vector3(2,2,2))
    }

    public setText(text : string){
        this.text.setText(text);
    }

    
    public update(time: number, delta: number): void {

    }
}

export default OptionEntity
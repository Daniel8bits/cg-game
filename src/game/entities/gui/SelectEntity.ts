import { Matrix4, Vector2 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Scene from "@razor/core/Scene";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import GuiEntity from "./GuiEntity";
import OptionEntity from "./OptionEntity";

class SelectEntity extends GuiEntity {

    public constructor(name: string, renderer: Renderer,scene : Scene) {
        super(name, renderer);
        this.setScene(scene);
    }

    
    public addOption(text: string): OptionEntity {
        const name = text.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
        const entity = new OptionEntity(name, this.getRenderer(),this.getScene())
        entity.setText(text);
        entity.getTransform().parent = this;
        this.getScene().add(entity);
        return entity;
    }

    
    public update(time: number, delta: number): void {

    }
}

export default SelectEntity
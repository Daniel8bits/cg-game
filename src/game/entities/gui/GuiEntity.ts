import { Matrix4 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import ResourceManager from "@razor/core/ResourceManager";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";
import RectangleEntity from "./RectangleEntity";
import TextEntity from "./TextEntity";

class GuiEntity extends Entity {

    public constructor(name: string, renderer: Renderer) {
        super(name, null,null, renderer);
    }

    public addRectangle(name: string): RectangleEntity {
        const entity = new RectangleEntity(name, ResourceManager.getVAO("rectangle"), ResourceManager.getMaterial("rectangle"), this.getRenderer())
        entity.transform.parent = this;
        return entity;
    }

    public addText(name: string): TextEntity {
        const entity = new TextEntity(name, ResourceManager.getVAO("text"), ResourceManager.getMaterial("text"), this.getRenderer());
        entity.transform.parent = this;
        return entity;
    }


    public update(time: number, delta: number): void {

    }
}

export default GuiEntity
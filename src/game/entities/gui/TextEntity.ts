import { Matrix4 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";

class TextEntity extends Entity {
    private time;
    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
    }

    public render(): void {
        const text = Text.render(Math.round(this.time)+" segundos");
        this.getVAO().getVbo(0).setBuffer(text.arrays.position);
        this.getVAO().getVbo(1).setBuffer(text.arrays.texcoord);
        this.getVAO().create();
    }
    
    public update(time: number, delta: number): void {
        this.time = time;

    }
}

export default TextEntity
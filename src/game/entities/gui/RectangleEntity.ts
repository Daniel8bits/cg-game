import { Matrix4, Vector2 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";

class RectangleEntity extends Entity {
    private size: Vector2;

    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this.size = new Vector2(0,0);
    }
    private DrawRectangle(){
        const positions = [
            0, 0,
            this.size.x, 0,
            0, this.size.y,
            0, this.size.y,
            this.size.x, 0,
            this.size.x, this.size.y,
        ];
        this.getVAO().getIbo().setBuffer(new Float32Array(positions));
        this.getVAO().create();
    }
    
    public setSize(width: number,height : number){
        this.size = new Vector2(width,height);
        this.DrawRectangle();
    }

    
    public update(time: number, delta: number): void {

    }
}

export default RectangleEntity
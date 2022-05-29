import { Matrix4, Vector2, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../engine/appearance/material/Material";
import VAO from "../../../engine/buffer/VAO";
import Entity from "../../../engine/core/entities/Entity";
import Renderer from "../../../engine/renderer/Renderer";
import Text from "../../utils/Text";

class RectangleEntity extends Entity {
    private size: Vector2;

    public color : Vector3 = new Vector3(0.3,0.3,0.3);
    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this.size = new Vector2(1,1);
        this.DrawRectangle();
    }
    private DrawRectangle(){
        const positions = [
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 0,
            1, 1,
        ];
        this.getVAO().getIbo().setBuffer(new Float32Array(positions));
        this.getVAO().create();
    }
    
    public setSize(width: number,height : number){
        //this.size = new Vector2(width,height);
        //this.DrawRectangle();
        this.getTransform().setScale(new Vector3(width,height ,1));
    }

    
    public update(time: number, delta: number): void {

    }
}

export default RectangleEntity
import { Matrix4, Vector2, Vector3 } from "@math.gl/core";
import VBO from "@razor/buffer/VBO";
import Razor from "@razor/core/Razor";
import GLUtils, { gl } from "@razor/gl/GLUtils";
import Material from "../../../../engine/appearance/material/Material";
import VAO from "../../../../engine/buffer/VAO";
import Entity from "../../../../engine/core/entities/Entity";
import Renderer from "../../../../engine/renderer/Renderer";
import Text from "../../../utils/Text";

import {PositionOptions,PositionRelative} from './gui';

class RectangleEntity extends Entity {
    private size: Vector2;

    public color : Vector3 = new Vector3(0.3,0.3,0.3);
    private alpha : number = 0.1;
    public constructor(name: string, vao: VAO, material: Material, renderer: Renderer) {
        super(name, vao, material, renderer);
        this.size = new Vector2(1,1);
        //this.DrawRectangle();
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
        this.getTransform().setScale(new Vector3(width,height ,1));
    }

    public getSize(){
        const scale = this.getTransform().getScale();
        return {width: scale[0],height: scale[1]}
    }

    public updatePosition(position: PositionOptions,relativeTo: PositionRelative = "Razor") {
        const { width, height } = this.getSize();
        const relative = {
            width: relativeTo == "Razor" ? Razor.CANVAS.width : relativeTo.getScale()[0],
            height: relativeTo == "Razor" ? Razor.CANVAS.height : relativeTo.getScale()[1]
        }
        let top = 0, left = 0;
        switch (position.vertical) {
            case "center":
            case "bottom":
                top = relative.height;
                if (position.vertical == "bottom") top = - height;
                if (position.vertical == "center") top = top / 2 - height / 2;
                break;
            case "top":
                break;
            default:
                const [, x, metric] = position.vertical.split(/([0-9]+)(px|%)/);
                if (metric == "px") {
                    top = Number(x);
                } else {
                    top = relative.height * Number(x) / 100;
                }

        }
        switch (position.horizontal) {
            case "center":
            case "right":
                left = relative.width;
                if (position.horizontal == "right") left -= width;
                if (position.horizontal == "center") left = left / 2 - width / 2;
                break;
            case "left":
                break;
            default:
                const [, x, metric] = position.vertical.split(/([0-9]+)(px|%)/);
                if (metric == "px") {
                    left = Number(x);
                } else {
                    left = relative.width * Number(x) / 100;
                }
        }
        this.getTransform().setTranslation(new Vector3(left, top, 0).negate())
    }

    public setAlpha(value : number){
        return this.alpha = value;
    }

    
    public update(time: number, delta: number): void {

    }
}

export default RectangleEntity
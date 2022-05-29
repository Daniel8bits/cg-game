import {Vector3} from "@math.gl/core"
import ResourceManager from "@razor/core/ResourceManager";
import Renderer from "../../engine/renderer/Renderer";
import SimpleEntity from "./SimpleEntity";

class Lamp extends SimpleEntity {

    public color : Vector3
    public distance: number = 100;
    public shininess:number = 32;

    public constructor(name: string, renderer: Renderer, color: Vector3 ) {
        super(
            name, 
            ResourceManager.getVAO('lamp'), 
            ResourceManager.getMaterial('lamp'), 
            renderer
        );
        this.color = color;
        //this.color = new Vector3(Math.random(),Math.random(),Math.random());
    }
    
    public update(time: number, delta: number): void {

        /*

        this.getTransform().getRotation().y += 15 * delta
        this.getTransform().getRotation().x += 20 * delta

        if(this.getTransform().getRotation().y >= 360) {
            this.getTransform().getRotation().y %= 360
        }

        if(this.getTransform().getRotation().x >= 360) {
            this.getTransform().getRotation().x %= 360
        }

        */

    }
}

export default Lamp;
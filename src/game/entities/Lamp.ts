import {Vector3} from "@math.gl/core"
import ResourceManager from "@razor/core/ResourceManager";
import Scene from "@razor/core/scenes/Scene";
import Updater from "@razor/core/updater/Updater";
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
    }
    
    public update(time: number, delta: number, currentScene : Scene, updater: Updater): void {

    }
}

export default Lamp;
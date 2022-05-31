import Hitbox from "@razor/physics/hitboxes/HitBox";
import Material from "../../engine/appearance/material/Material";
import VAO from "../../engine/buffer/VAO";
import Renderer from "../../engine/renderer/Renderer";
import MapEntity from "./MapEntity";

class DoorPanelEntity extends MapEntity {


    public constructor(
        name: string, 
        hitbox: Hitbox,
        friction: number,
        vao: VAO, 
        material: Material, 
        renderer: Renderer
      ) {
          super(name, hitbox, friction, vao, material, renderer);
      }
    
    public update(time: number, delta: number): void {
        

    }

}

export default DoorPanelEntity
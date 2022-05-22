import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Mat4 from "../../engine/math/Mat4";
import Entity from "../../engine/core/Entity";
import Vec3 from "../../engine/math/Vec3";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import Razor from "@razor/core/Razor";

class GuiRenderer extends Renderer {

    private _projection: Matrix4;
    private _camera: CanvasCamera

    constructor(camera: CanvasCamera) {
        super('guirenderer')
        this._camera = camera
        //this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })
    }

    public render() {

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setVector3('u_color',new Vector3(1,0.2,0.3));
            shader.setVector3('u_resolution', new Vector3(Razor.CANVAS.width,Razor.CANVAS.height,0));
            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                                
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })

            material.unbind()

        })

    }
}

export default GuiRenderer
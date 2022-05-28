import { Matrix4, Vector3, cos } from "@math.gl/core"

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
    private _camera: CanvasCamera;
    constructor(camera: CanvasCamera) {
        super('guirenderer')
        this._camera = camera;
        this._projection = new Matrix4().ortho({
            top: 0,
            left: 0,
            right: Razor.CANVAS.width,
            bottom: Razor.CANVAS.height,
            near: -1,
            far: 100
        })
    }

    public render() {
        gl.disable(gl.CULL_FACE)
        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            //shader.setVector3('u_color',new Vector3(1,0.2,0.3));
            shader.setMatrix4x4('u_projection', this._projection);
            //shader.setVector3('u_resolution', new Vector3(Razor.CANVAS.width,Razor.CANVAS.height,0));
            this.getEntitiesByMaterial(material).forEach((entity: Entity, index: number) => {
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                entity.render();
                entity.getVAO().bind()
                //entity.getVAO().getIbo().getLength()/2
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();

            })

            material.unbind()

        })
        gl.enable(gl.CULL_FACE)

    }
}

export default GuiRenderer
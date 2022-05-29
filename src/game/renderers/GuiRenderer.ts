import { Matrix4, Vector3, cos } from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import Razor from "@razor/core/Razor";
import ImageEntity from "../entities/gui/ImageEntity";

class GuiRenderer extends Renderer {

    private _projection: Matrix4;

    constructor(camera: CanvasCamera) {
        super('guirenderer',camera)
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
            shader.setMatrix4x4('u_projection', this._projection);
            this.getEntitiesByMaterial(material).forEach((entity: Entity, index: number) => {
                if('color' in entity){
                    //@ts-ignore
                    shader.setVector3('u_color',entity.color);
                }

                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                entity.render();
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();

            })

            material.unbind()

        })
        gl.enable(gl.CULL_FACE)

    }
}

export default GuiRenderer
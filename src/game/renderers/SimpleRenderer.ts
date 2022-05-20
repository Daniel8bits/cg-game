import {Matrix4} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Mat4 from "../../engine/math/Mat4";
import Entity from "../../engine/core/Entity";
import Vec3 from "../../engine/math/Vec3";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";

class SimpleRenderer extends Renderer {

    private _projection: Matrix4;
    private _camera: CanvasCamera

    constructor(camera: CanvasCamera) {
        super('renderer1')
        this._camera = camera
        //this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })
        /*
        this._ortho = Mat4.orthographic(
            0, 
            window.innerWidth,
            0,
            window.innerHeight,
            -1,
            100
        );
        */
    }

    public render() {

        /*
        ResourceManager.forEachShader((shader) => {
            shader.bind();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', Mat4.view(
                this._camera.getTransform().getTranslation(),
                this._camera.getTransform().getRotation(),
            ));

            gl.activeTexture(gl.TEXTURE0);
            ResourceManager.getTexture('level-texture').bind();
            shader.setInt('u_texture', 0)
            //shader.setTexture('u_texture');

            this.getEntitiesByShader(shader). forEach((entity: Entity) => {
                shader.setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
        })
        */

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            material.getShader().setMatrix4x4('u_projection', this._projection);
            material.getShader().setMatrix4x4('u_view', this._camera.getView())
            /*
            material.getShader().setMatrix4x4('u_view', Mat4.view(
                this._camera.getTransform().getTranslation(),
                this._camera.getTransform().getRotation(),
            ));
            */

            this.getEntitiesByMaterial(material).forEach((entity: Entity) => {
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })

            material.unbind()

        })

    }
}

export default SimpleRenderer
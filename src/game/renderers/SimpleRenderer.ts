import Renderer from "../../engine/renderer/Renderer";
import ResourceLoader from "../../engine/core/ResourceLoader";
import { gl } from "../../engine/gl/GLUtils";
import Mat4 from "../../engine/math/Mat4";
import Entity from "../../engine/core/Entity";
import Vec3 from "../../engine/math/Vec3";
import CanvasCamera from '../CanvasCamera'

class SimpleRenderer extends Renderer {

    private _projection: Mat4;
    private _camera: CanvasCamera

    constructor(camera: CanvasCamera) {
        super('renderer1')
        this._camera = camera
        this._projection = Mat4.perspective(70, window.innerWidth / window.innerHeight, 1, 1000)
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

        ResourceLoader.forEachShader((shader) => {
            shader.bind();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', Mat4.view(
                this._camera.getTransform().getTranslation(),
                this._camera.getTransform().getRotation(),
            ));

            this.getEntitiesByShader(shader). forEach((entity: Entity) => {
                shader.setMatrix4x4('u_transform', entity.getTransform().toMatrix());
                entity.getVAO().bind()
                gl.drawElements(gl.TRIANGLES, entity.getVAO().getIbo().getLength(), gl.UNSIGNED_SHORT, 0);
                entity.getVAO().unbind();
            })
        })

    }
}

export default SimpleRenderer
import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import MapEntity from "../entities/MapEntity";

class MapRenderer extends Renderer {

    private _projection: Matrix4;

    constructor(camera: CanvasCamera) {
        super('map-renderer', camera)
        
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })

        this._maximumRenderDistance = 150

    }


    public render() {

        ResourceManager.forEachMaterial((material) => {
            material.bind()
            const shader = material.getShader();
            shader.setMatrix4x4('u_projection', this._projection);
            shader.setMatrix4x4('u_view', this.getCamera().getView());

            this.getEntitiesByMaterial(material).forEach((entity: Entity,index : number) => {
                if(!(entity instanceof MapEntity)) return;
                
                shader.setVector3("u_resolution",new Vector3(0,0,0))
                material.getShader().setMatrix4x4('u_transform', entity.getTransform().worldMatrix());
                
                material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
                entity.getVAO().bind()
                GLUtils.draw(entity.getVAO().getLength())
                entity.getVAO().unbind();
            })
            
            material.unbind()

        })


    }

}

export default MapRenderer
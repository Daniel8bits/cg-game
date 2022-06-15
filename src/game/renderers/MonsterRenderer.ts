import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import MapEntity from "../entities/MapEntity";
import Lamp from "../entities/Lamp";
import Material from "@razor/appearance/material/Material";
import VAO from "@razor/buffer/VAO";
import Monster from "../entities/monster/Monster";
import Player from "../entities/player/Player";

class MonsterRenderer extends Renderer {

    private _projection: Matrix4;

    private _material: Material
    private _vao: VAO

    private _player: Player

    constructor(camera: CanvasCamera) {
        super('monster-renderer', camera)
        
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })
        this._material = ResourceManager.getMaterial('monster')
        this._vao = ResourceManager.getVAO('monster')

        this._maximumRenderDistance = 75

    }

    public setPlayer(player: Player): void {
        this._player = player;
    }

    private distanceConfig = {
        7: [1.0,	0.7,	1.8],
        13:[1.0,	0.35,	0.44],
        20:[1.0,	0.22,	0.20],
        32:[1.0,	0.14,	0.07],
        50:[1.0,	0.09,	0.032],
        65:[1.0,	0.07,	0.017],
        100:[1.0,	0.045,	0.0075],
        160:[1.0,	0.027,	0.0028],
        200:[1.0,	0.022,	0.0019],
        325:[1.0,	0.014,	0.0007],
        600:[1.0,	0.007,	0.0002],
        3250: [1.0,	0.0014,	0.000007]
    };


    public render() {
        
        this._material.bind()
        const shader = this._material.getShader();
        shader.setMatrix4x4('u_projection', this._projection);
        shader.setMatrix4x4('u_view', this.getCamera().getView());
        const cameraPosition = this.getCamera().getTransform().getTranslation();
        shader.setVector3('u_camera_position',cameraPosition.negate())
        shader.setVector3('u_color',new Vector3(1,0.2,0.3));
        shader.setVector3("lightCamera.color.ambient", new Vector3(1,1,1));
        shader.setVector3("lightCamera.color.diffuse", new Vector3(0.5,0.5,0.5))
        shader.setVector3("lightCamera.color.specular",new Vector3(0.3,0.3,0.3));
        //shader.setFloat("u_light.cutOff",cos(toRadians(0))); AINDA NÃO SEI O QUE FAZER AQUI

        shader.setVector3("lightCamera.position",cameraPosition.negate())
        const distance = this.distanceConfig[100];
        shader.setFloat("lightCamera.distance.constant", distance[0]);
        shader.setFloat("lightCamera.distance.linear", distance[1])
        shader.setFloat("lightCamera.distance.quadratic",distance[2]);
        shader.setFloat("lightCamera.shininess",32)
        
        this._vao.bind()

        const position = this._player.getTransform().getTranslation()
        
        this.getEntitiesByMaterial(this._material)
            .filter(entity => entity instanceof Monster)
            .sort((entity1, entity2) => {
                const distanceA = position.distanceTo(entity1.getTransform().getTranslation())
                const distanceB = position.distanceTo(entity2.getTransform().getTranslation())
                if(distanceA < distanceB) return 1;
                if(distanceA > distanceB) return -1;
                return 0;
            }).forEach((entity: Entity,index : number) => {
            (entity as Monster).getLampList().forEach((lamp, i) => {
                
                const path = `pointLights[${i}]`;
                shader.setVector3(path+".color.ambient", lamp.color);
                shader.setVector3(path+".color.diffuse", lamp.color)
                shader.setVector3(path+".color.specular",lamp.color);
                const distance = this.distanceConfig[lamp.distance];
                shader.setFloat(path+".distance.constant", distance[0]);
                shader.setFloat(path+".distance.linear", distance[1])
                shader.setFloat(path+".distance.quadratic",distance[2]);
                shader.setFloat(path+".shininess",lamp.shininess);
                shader.setVector3(path+".position",lamp.getTransform().getTranslation().negate());
                
            })
            
            shader.setInt("applyLight", 1);
            this._material.getShader().setMatrix4x4('u_transform', this._getTransformMatrix(entity as Monster));
            this._material.getShader().setMatrix4x4('u_worldInverseTranspose',entity.getTransform().toMatrix().invert().transpose());
            
            GLUtils.draw(this._vao.getLength())
            
        })
        this._vao.unbind();
        
        this._material.unbind()

    }

    private _getTransformMatrix(monster: Monster): Matrix4 {

        const playerPosition = this._player.getTransform().getTranslation()
        const monsterPosition = monster.getTransform().getTranslation()

        const distance = monsterPosition.subtract(playerPosition).normalize()
        
        const ROTATION = new Matrix4([
            distance.z, 0, -distance.x, 0,
            0,          1, 0,           0,
            distance.x, 0, distance.z,  0,
            0,          0, 0,           1
        ])

        const TRANSLATION = new Matrix4().translate(monster.getTransform().getTranslation().negate())

        const SCALE = new Matrix4().scale(monster.getTransform().getScale())

        return TRANSLATION.multiplyRight(ROTATION.multiplyRight(SCALE))

    }

}

export default MonsterRenderer
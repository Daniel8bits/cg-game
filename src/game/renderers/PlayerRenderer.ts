import {Matrix4, Vector3,cos} from "@math.gl/core"

import Renderer from "../../engine/renderer/Renderer";
import ResourceManager from "../../engine/core/ResourceManager";
import GLUtils, { gl } from "../../engine/gl/GLUtils";
import Entity from "../../engine/core/entities/Entity";
import CanvasCamera from '../CanvasCamera'
import { toRadians } from "@razor/math/math";
import Lamp from "../entities/Lamp";
import SimpleEntity from "../entities/SimpleEntity";
import Player from "../entities/player/Player";
import { IEntityWithLight } from "../entities/IEntityWithLight";
import VAO from "@razor/buffer/VAO";
import Shader from "@razor/appearance/Shader";
import Gun from "../entities/player/Gun";

class LampConfig{

    constructor(public lamp: Lamp,public distance: number){

    }
}

class PlayerRenderer extends Renderer {

    private _projection: Matrix4;

    private _player: Player
    private _gun: Gun

    constructor(camera: CanvasCamera) {
        super('player-renderer', camera)
        this._projection = new Matrix4().perspective({
            fovy: toRadians(70), 
            aspect: window.innerWidth / window.innerHeight, 
            near: 1, 
            far: 1000
        })
        this._player = null
        this._gun = null
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

    public setPlayer(player: Player, gun: Gun): void {
        this._player = player
        this._gun = gun
    }

    public render() {
        if(this._player.getStop()) return;
        this._bindMaterial(this._player)
        this._renderHand()
        this._player.getMaterial().unbind()

        this._bindMaterial(this._gun)
        this._renderGun()
        this._gun.getMaterial().unbind()

    }

    private _bindMaterial(entity: Entity): void {
        const material = entity.getMaterial()
        material.bind()
        const shader = material.getShader();
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
        shader.setFloat("lightCamera.shininess",32);

        ((entity as unknown) as IEntityWithLight).getLampList().forEach((lamp, i) => {
            
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
    }

    private _renderHand(): void {

        const u_transform = this._player.getHandTransformMatrix()

        this._renderObject(
            this._player.getVAO(),
            this._player.getMaterial().getShader(),
            u_transform,
            new Matrix4(u_transform).invert().transpose()
        )

    }

    private _renderGun(): void {

        const receiverTransform = this._gun.getTransform().worldMatrix()
        
        this._renderObject(
            this._gun.getVAO(),
            this._gun.getMaterial().getShader(),
            receiverTransform,
            new Matrix4(receiverTransform).invert().transpose()
        )

        const sliderTransform = this._gun.getSliderTransform().worldMatrix()

        this._renderObject(
            this._gun.getSliderVAO(),
            this._gun.getMaterial().getShader(),
            sliderTransform,
            new Matrix4(sliderTransform).invert().transpose()
        )

    }

    private _renderObject(vao: VAO, shader: Shader, u_transform: Matrix4, u_worldInverseTranspose: Matrix4) {
        shader.setMatrix4x4('u_transform', u_transform);
        shader.setMatrix4x4('u_worldInverseTranspose', u_worldInverseTranspose);
        vao.bind()
        GLUtils.draw(vao.getLength())
        vao.unbind();
    }
}

export default PlayerRenderer
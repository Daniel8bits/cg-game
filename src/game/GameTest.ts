import {Vector3, Quaternion, Matrix4} from "@math.gl/core"
import GameCore from '@razor/core/GameCore'
import ResourceManager from '../engine/core/ResourceManager'
import Scene from '../engine/core/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
import Vec3 from '../engine/math/Vec3';
import CanvasCamera from './CanvasCamera'
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';
import Orientation from "@razor/math/Orientation";
import Lamp from "./entities/Lamp";
import GuiRenderer from "./renderers/GuiRenderer";

import Event from "src/event"; // @temp

class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main', new Vector3(5,0,35), new Orientation(0,90));

        // ========= SHADER ==========
        
        /* Shader com Iluminação */
        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/shader1/vert.glsl', 
            fragmentShaderPathname: '/resources/shader/shader1/frag.glsl'
        }])

        /* Shader sem Iluminação */
        ResourceManager.loadShader([{
            name: 'shader2',
            vertexShaderPathname: '/resources/shader/shader2/vert.glsl', 
            fragmentShaderPathname: '/resources/shader/shader2/frag.glsl'
        }])

        ResourceManager.loadTextures([
            {
                name: 'level',
                pathname: '/resources/objects/level/level-texture.png'
            }, 
            {
                name: 'elevator',
                pathname: '/resources/objects/level/elevator-texture.png'
            },
            {
                name: 'elevator-door',
                pathname: '/resources/objects/doors/elevator-door-texture.png'
            },
            {
                name: 'lamp',
                pathname: '/resources/objects/lamp/lamp-texture.png'
            }
        ])
        
        ResourceManager.addMaterials([
            new DefaultMaterial(
                'level', 
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('level'),
            ),
            new DefaultMaterial(
                'elevator', 
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('elevator'),
            ),
            new DefaultMaterial(
                'elevator-door', 
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('elevator-door'),
            ),
            new DefaultMaterial(
                'lamp', 
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'gui', 
                ResourceManager.getShader('shader2'),
                ResourceManager.getTexture('lamp'),
            )
        ])
        .forEachMaterial((material) => {
            material.create()
        })

        ResourceManager.loadVAO([
            {
                name: 'level',
                objectData: '/resources/objects/level/level.obj'
            },
            {
                name: 'hall',
                objectData: '/resources/objects/level/hall.obj'
            },
            {
                name: 'elevator',
                objectData: '/resources/objects/level/elevator.obj'
            },
            {
                name: 'elevator-door',
                objectData: '/resources/objects/doors/elevator-door.obj'
            },
            {
                name: 'lamp',
                objectData: '/resources/objects/lamp/lamp.obj'
            }
        ])
        .forEachVAO((vao) => {
            vao.create();
        })


        const simpleRenderer = new SimpleRenderer(this._camera);
        const guiRenderer = new GuiRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)
        this.getRenderStrategy().add(guiRenderer)

        this.getSceneManager()
            .add(new Scene('scene1'), true)
            .get('scene1')
            .add(new SimpleEntity(
                'entity1', 
                ResourceManager.getVAO('level'), 
                ResourceManager.getMaterial('level'),
                simpleRenderer
            ))
        const entity1 = this.getSceneManager().get('scene1').get('entity1');
            entity1.getTransform().setTranslation(new Vector3(0, -0.75, 0))
            entity1.getTransform().setScale(new Vector3(10, 10, 10))

        this.getSceneManager()
            .get('scene1')
            .add(new SimpleEntity(
                'entity2', 
                ResourceManager.getVAO('hall'), 
                ResourceManager.getMaterial('level'),
                simpleRenderer
            ));

        const entity2 = this.getSceneManager().get('scene1').get('entity2');
        entity2.getTransform().setTranslation(new Vector3(-67, 0, 0))
        entity2.getTransform().setScale(new Vector3(10, 10, 10))

        this.getSceneManager()
            .get('scene1')
            .add(new SimpleEntity(
                'entity3', 
                ResourceManager.getVAO('elevator'), 
                ResourceManager.getMaterial('elevator'),
                simpleRenderer
            ));

        const entity3 = this.getSceneManager().get('scene1').get('entity3');
        entity3.getTransform().setTranslation(new Vector3(-102, -0.75, 0))
        entity3.getTransform().setScale(new Vector3(10, 10, 10))

        this.getSceneManager()
            .get('scene1')
            .add(new SimpleEntity(
                'elevator-door', 
                ResourceManager.getVAO('elevator-door'), 
                ResourceManager.getMaterial('elevator-door'),
                simpleRenderer
            ));

        const elevatorDoor = this.getSceneManager().get('scene1').get('elevator-door');
        elevatorDoor.getTransform().setTranslation(new Vector3(-102, -0.75, 0))
        elevatorDoor.getTransform().setScale(new Vector3(10, 10, 10))

        this.getSceneManager().get("scene1").add(new Lamp(
            'lamp',
            ResourceManager.getVAO("lamp"),
            ResourceManager.getMaterial("lamp"),
            simpleRenderer    
        ));

        const entity4 = this.getSceneManager().get('scene1').get('lamp');
        entity4.getTransform().setTranslation(new Vector3(20, 0, 30))

        this.getSceneManager().get("scene1").add(new Lamp(
            'lamp2',
            ResourceManager.getVAO("lamp"),
            ResourceManager.getMaterial("lamp"),
            simpleRenderer    
        ));

        const entity5 = this.getSceneManager().get('scene1').get('lamp2');
        entity5.getTransform().setTranslation(new Vector3(-20, 0, -30))
/*
        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'test',
            ResourceManager.getVAO("hall"),
            ResourceManager.getMaterial("gui"),
            guiRenderer    
        ));
        const test = this.getSceneManager().get('scene1').get('test');
        test.getTransform().setTranslation(new Vector3(0,1,0))*/
        Event.trigger("loadScene",this.getSceneManager().getActive());
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        this._camera.update(delta)
    }

    public render() {
        super.render();
    }


}

export default GameTest
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


class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main', new Vector3(5,0,35), new Orientation(0,90));

        // ========= SHADER ==========

        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/shader1/vert.glsl', 
            fragmentShaderPathname: '/resources/shader/shader1/frag.glsl'
        }])

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
                'lamp', 
                ResourceManager.getShader('shader2'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'lamp2', 
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('lamp'),
            ),
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
                name: 'lamp',
                objectData: '/resources/objects/lamp/lamp.obj'
            }
        ])
        .forEachVAO((vao) => {
            vao.create();
        })


        const simpleRenderer = new SimpleRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)

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

        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'lamp',
            ResourceManager.getVAO("lamp"),
            ResourceManager.getMaterial("lamp2"),
            simpleRenderer    
        ));

        const entity4 = this.getSceneManager().get('scene1').get('lamp');
        entity4.getTransform().setTranslation(new Vector3(20, 0, 30))
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
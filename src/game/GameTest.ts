import GameCore from '@razor/core/GameCore'
import ResourceManager from '../engine/core/ResourceManager'
import Scene from '../engine/core/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
import Vec3 from '../engine/math/Vec3';
import CanvasCamera from './CanvasCamera'
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';


class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main');

        // ========= SHADER ==========

        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/vert.glsl', 
            fragmentShaderPathname: '/resources/shader/frag.glsl'
        }])

        ResourceManager.loadTextures([
            {
                name: 'level',
                pathname: '/resources/objects/level/level-texture.png'
            }, 
            {
                name: 'elevator',
                pathname: '/resources/objects/level/elevator-texture.png'
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
            entity1.getTransform().setTranslation(new Vec3(0, -0.75))
            entity1.getTransform().setScale(new Vec3(10, 10, 10))

        this.getSceneManager()
            .get('scene1')
            .add(new SimpleEntity(
                'entity2', 
                ResourceManager.getVAO('hall'), 
                ResourceManager.getMaterial('level'),
                simpleRenderer
            ));

        const entity2 = this.getSceneManager().get('scene1').get('entity2');
        entity2.getTransform().setTranslation(new Vec3(-67))
        entity2.getTransform().setScale(new Vec3(10, 10, 10))

        this.getSceneManager()
            .get('scene1')
            .add(new SimpleEntity(
                'entity3', 
                ResourceManager.getVAO('elevator'), 
                ResourceManager.getMaterial('elevator'),
                simpleRenderer
            ));

        const entity3 = this.getSceneManager().get('scene1').get('entity3');
        entity3.getTransform().setTranslation(new Vec3(-102, -0.75))
        entity3.getTransform().setScale(new Vec3(10, 10, 10))


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
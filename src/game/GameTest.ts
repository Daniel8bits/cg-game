import VBO from '../engine/buffer/VBO';
import GameCore from '../engine/core/GameCore'
import ResourceLoader from '../engine/core/ResourceLoader'
import Scene from '../engine/core/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
import Vec3 from '../engine/math/Vec3';
import TextureLoader from '../engine/loader/TextureLoader';
import CanvasCamera from './CanvasCamera'


class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main');

        // ========= SHADER ==========

        ResourceLoader.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/vert.glsl', 
            fragmentShaderPathname: '/resources/shader/frag.glsl'
        }])
        .forEachShader((shader) => {
            shader.create();
        })

        ResourceLoader.loadVAO([
            {
                name: 'level',
                objectData: '/resources/objects/level/level.obj'
            }
        ])
        .forEachVAO((vao) => {
            vao.create();
        })

        ResourceLoader.loadTextures([
            {
                name: 'level-texture',
                pathname: '/resources/objects/level/level-texture.png'
            }
        ])
        .forEachTexture((texture) => {
            texture.create();
        })

        const simpleRenderer = new SimpleRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)

        this.getSceneManager()
            .add(new Scene('scene1'), true)
            .get('scene1')
            .add(new SimpleEntity(
                'entity1', 
                ResourceLoader.getVAO('level'), 
                ResourceLoader.getShader('shader1'),
                simpleRenderer
            ))
            .get('entity1')
            .getTransform()
            .setScale(new Vec3(10, 10, 10))


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
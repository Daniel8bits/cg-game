import { Vector3, Quaternion, Matrix4 } from "@math.gl/core"
import GameCore from '@razor/core/GameCore'
import ResourceManager from '@razor/core/ResourceManager'
import Scene from '@razor/core/Scene';
import SimpleRenderer from './renderers/SimpleRenderer'
import SimpleEntity from './entities/SimpleEntity'
import Vec3 from '../engine/math/Vec3';
import CanvasCamera from './CanvasCamera'
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';
import Orientation from "@razor/math/Orientation";
import Lamp from "./entities/Lamp";
import GuiRenderer from "./renderers/GuiRenderer";

import Event from "src/event"; // @temp
import FileUtils from "@razor/utils/FileUtils";
import Text from "./gui/Text";
import VAO from "@razor/buffer/VAO";
import VBO from "@razor/buffer/VBO";
import TextTexture from "./gui/TextTexture";
import { gl } from "@razor/gl/GLUtils";
import Razor from "@razor/core/Razor";
import EntityFactory from "./entities/EntityFactory";

class GameTest extends GameCore {

    private _camera: CanvasCamera

    public constructor() {
        super()
    }

    public start() {

        this._camera = new CanvasCamera('main', new Vector3(5, 0, 35), new Orientation(0, 90));

        // ========= SHADER ==========

        /* Shader com Iluminação */
        ResourceManager.loadShader([{
            name: 'shader1',
            vertexShaderPathname: '/resources/shader/shader1/vert.glsl',
            fragmentShaderPathname: '/resources/shader/shader1/frag.glsl'
        }])

        /* Shader sem Iluminação */
        ResourceManager.loadShader([{
            name: 'gui',
            vertexShaderPathname: '/resources/shader/gui/vert.glsl',
            fragmentShaderPathname: '/resources/shader/gui/frag.glsl'
        }])

        /* Shader de Texto */
        ResourceManager.loadShader([{
            name: 'text',
            vertexShaderPathname: '/resources/shader/text/vert.glsl',
            fragmentShaderPathname: '/resources/shader/text/frag.glsl'
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
                name: 'hall-door',
                pathname: '/resources/objects/doors/hall-door-texture.png'
            },
            {
                name: 'door-panel-locked',
                pathname: '/resources/objects/panels/door-panel-locked.png'
            },
            {
                name: 'door-panel-unlocked',
                pathname: '/resources/objects/panels/door-panel-unlocked.png'
            },
            {
                name: 'lamp',
                pathname: '/resources/objects/lamp/lamp-texture.png'
            },
            {
                name: 'text',
                pathname: '/resources/objects/8x8-font.png'
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
                'hall-door',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('hall-door'),
            ),
            new DefaultMaterial(
                'door-panel',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('door-panel-locked'),
            ),
            new DefaultMaterial(
                'lamp',
                ResourceManager.getShader('shader1'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'gui',
                ResourceManager.getShader('gui')
            ),
            new DefaultMaterial(
                'text',
                ResourceManager.getShader('text'),
                ResourceManager.getTexture('text'),
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
                name: 'level-2',
                objectData: '/resources/objects/level/level-2.obj'
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
                name: 'hall-door',
                objectData: '/resources/objects/doors/hall-door.obj'
            },
            {
                name: 'door-panel',
                objectData: '/resources/objects/panels/door-panel.obj'
            },
            {
                name: 'lamp',
                objectData: '/resources/objects/lamp/lamp.obj'
            },
            {
                name: 'text',
                objectData: () => {
                    const text = Text.render("c");
                    const vbos = [];
                    vbos.push(new VBO(text.arrays.position, 2, true, gl.DYNAMIC_DRAW));
                    vbos.push(new VBO(text.arrays.texcoord, 2, true, gl.DYNAMIC_DRAW));
                    return new VAO(vbos,2);
                }
            },
            {
                name: 'gui',
                objectData: () => {
                    const width = 100;
                    const height = 100;
                    const positions = [
                        0,0,
                        0,width,
                        width,height,
                        width,height,
                        width,0,
                        0,0
                    ]
                    return new VAO([new VBO(new Float32Array(positions),2,true)], 2);
                }
            }
        ])
        .forEachVAO((vao) => {
            vao.create();
        })


        const guiRenderer = new GuiRenderer(this._camera);
        this.getRenderStrategy().add(guiRenderer)
        const simpleRenderer = new SimpleRenderer(this._camera);
        this.getRenderStrategy().add(simpleRenderer)

        this.getSceneManager().add(new Scene('scene1'), true)

        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'guileft',
            ResourceManager.getVAO("gui"),
            ResourceManager.getMaterial("gui"),
            guiRenderer
        ));
        const guileft = this.getSceneManager().get('scene1').get('guileft');
        const bottom = -Razor.CANVAS.height + 100;
        guileft.getTransform().setTranslation(new Vector3(0,bottom,0))

        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'guiright',
            ResourceManager.getVAO("gui"),
            ResourceManager.getMaterial("gui"),
            guiRenderer
        ));
        const guiright = this.getSceneManager().get('scene1').get('guiright');
        guiright.getTransform().setTranslation(new Vector3(-Razor.CANVAS.width + 100,bottom,0))
        //test.getTransform().setScale(new Vector3(0.1, 0.3,0.1))
        
        this.getSceneManager().get("scene1").add(new SimpleEntity(
            'text',
            ResourceManager.getVAO("text"),
            ResourceManager.getMaterial("text"),
            guiRenderer
        ));
        const text = this.getSceneManager().get('scene1').get('text');
        text.getTransform().setTranslation(new Vector3(15, 2, 25))
        text.getTransform().setRotation(new Orientation(0, 90))
        const translation = text.getTransform().getTranslation();
        /* start Gambiarra temporária */
        var fromEye = normalize(translation);
        var amountToMoveTowardEye = 150;  // because the F is 150 units long

        var desiredTextScale = -1 / gl.canvas.height * 2;  // 1x1 pixels
        var viewZ = translation[2] - fromEye[2] * amountToMoveTowardEye;
        var scale = viewZ * desiredTextScale;
        text.getTransform().setScale(new Vector3(scale,scale,1));
        /* end Gambiarra temporária */

        Event.trigger("loadScene", this.getSceneManager().getActive());


        new EntityFactory(
            this.getSceneManager(),
            this.getRenderStrategy()
        ).load()
    }

    public update(time: number, delta: number) {
        super.update(time, delta);

        this._camera.update(delta)
    }

    public render() {
        super.render();
    }

}

function normalize(v) {
    const dst = new Float32Array(3);
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
        dst[0] = v[0] / length;
        dst[1] = v[1] / length;
        dst[2] = v[2] / length;
    }
    return dst;
}
export default GameTest
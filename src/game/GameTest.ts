import { Vector3 } from "@math.gl/core";
import GameCore from '@razor/core/GameCore';
import ResourceManager from '@razor/core/ResourceManager';
import Scene from '@razor/core/scenes/Scene';
import Orientation from "@razor/math/Orientation";
import DefaultMaterial from '../engine/appearance/material/DefaultMaterial';
import CanvasCamera from './CanvasCamera';
import GuiRenderer from "./renderers/GuiRenderer";
import MapRenderer from './renderers/MapRenderer';

import VAO from "@razor/buffer/VAO";
import VBO from "@razor/buffer/VBO";
import Razor from "@razor/core/Razor";
import DoorPanelEntity from "./entities/DoorPanelEntity";
import DialogEntity from "./entities/gui/common/DialogEntity";
import ImageEntity from "./entities/gui/common/ImageEntity";
import DisplayEntity from "./entities/gui/DisplayEntity";
import Player from "./entities/player/Player";
import MonsterRenderer from "./renderers/MonsterRenderer";

import Gun from "./entities/player/Gun";
import DoorPanelMaterial from "./materials/DoorPanelMaterial";
import PlayerRenderer from "./renderers/PlayerRenderer";
import GameOverScene from "./scenes/GameOverScene";
import LoadingScene from "./scenes/LoadingScene";
import MainScene from "./scenes/MainScene";
import CreditsMenu from "./scenes/menu/CreditsMenu";
import MainMenu from "./scenes/menu/MainMenu";
import EndScene from "./scenes/EndScene";
import FadingRenderer from "./renderers/FadingRenderer";
import InstructionsMenu from "./scenes/menu/InstructionsMenu";
import Event from "src/event";

class GameTest extends GameCore {

    private _camera: CanvasCamera
    private static instance: GameTest;
    private _guiRenderer: GuiRenderer;
    public constructor() {
        super()
        GameTest.instance = this;
    }

    public static getInstance(): GameTest {
        return GameTest.instance;
    }

    public start() {

        ResourceManager.addSounds([
            //https://freesound.org/people/michorvath/sounds/427598/
            {
                name: "gun",
                pathname: "/resources/sound/gun.mp3"
            },
            //https://freesound.org/people/KlawyKogut/sounds/154934/#
            {
                name: "empty_gun",
                pathname: "/resources/sound/empty_gun.mp3"
            },
            //https://freesound.org/people/thencamenow/sounds/31236/
            {
                name: "door",
                pathname: "/resources/sound/door.mp3"
            },
            //https://freesound.org/people/julius_galla/sounds/193692/
            {
                name: "music",
                pathname: "/resources/sound/music.mp3",
                options: {
                    volume: 50
                }
            },
            //https://freesound.org/people/dkiller2204/sounds/366111/
            {
                name: "step",
                pathname: "/resources/sound/footstep.mp3"
            },
            //https://freesound.org/people/victorium183/sounds/476816/
            {
                name: "menu",
                pathname: "/resources/sound/menu.mp3",
                options: {
                    volume: 20
                }
            },
            //https://freesound.org/people/joedeshon/sounds/368738/
            {
                name: "elevator",
                pathname: "/resources/sound/elevator.mp3"
            },
            //https://freesound.org/people/Deathscyp/sounds/404109/
            {
                name: "damage",
                pathname: "/resources/sound/damage.mp3"
            },

            {
                name: "death-track",
                pathname: "/resources/sound/death-track.mp3"
            },
            {
                name: "monster-attack",
                pathname: "/resources/sound/monster-attack.mp3"
            },
            {
                name: "monster-death",
                pathname: "/resources/sound/monster-death.mp3"
            },
            {
                name: "monster-damage",
                pathname: "/resources/sound/monster-damage.mp3"
            },
            {
                name: "whispers",
                pathname: "/resources/sound/whispers.mp3"
            },
        ])

        this._camera = new CanvasCamera('main', new Vector3(51.1, 0, -88), new Orientation(0, -32));
        CanvasCamera.setMainCamera(this._camera);

        // ========= SHADER ==========

        /* Shader com Ilumina????o */
        ResourceManager.loadShader([{
            name: 'map',
            vertexShaderPathname: '/resources/shader/map/vert.glsl',
            fragmentShaderPathname: '/resources/shader/map/frag.glsl'
        }])

        /* Shader do monstro */
        ResourceManager.loadShader([{
            name: 'monster',
            vertexShaderPathname: '/resources/shader/monster/vert.glsl',
            fragmentShaderPathname: '/resources/shader/monster/frag.glsl'
        }])

        /* Shader com Ilumina????o para o DoorPanelEntity */
        ResourceManager.loadShader([{
            name: 'door-panel',
            vertexShaderPathname: '/resources/shader/door-panel/vert.glsl',
            fragmentShaderPathname: '/resources/shader/door-panel/frag.glsl'
        }])

        /* Shader sem Ilumina????o */
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

        /* Shader da Imagem */
        ResourceManager.loadShader([{
            name: 'image',
            vertexShaderPathname: '/resources/shader/image/vert.glsl',
            fragmentShaderPathname: '/resources/shader/image/frag.glsl'
        }])

        /* Shader do Effect */
        ResourceManager.loadShader([{
            name: 'effect',
            vertexShaderPathname: '/resources/shader/effect/vert.glsl',
            fragmentShaderPathname: '/resources/shader/effect/frag.glsl'
        }])

        /* Shader do Fading */
        ResourceManager.loadShader([{
            name: 'fading',
            vertexShaderPathname: '/resources/shader/fading/vert.glsl',
            fragmentShaderPathname: '/resources/shader/fading/frag.glsl'
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
                name: 'door-panel-display-map',
                pathname: '/resources/objects/panels/display-map.png'
            },
            {
                name: 'lamp',
                pathname: '/resources/objects/lamp/lamp-texture.png'
            },////
            {
                name: 'hand',
                pathname: '/resources/objects/gun/hand-texture.png'
            },
            {
                name: 'gun',
                pathname: '/resources/objects/gun/gun-texture.png'
            },
            {
                name: 'monster',
                pathname: '/resources/objects/monster/monster-texture.png'
            },
            {
                name: 'text',
                pathname: '/resources/images/8x8-font.png'
            },
            {
                name: 'instructions',
                pathname: '/resources/images/instructions.png'
            }
        ])
        //const textTexture = ResourceManager.getTexture("text");

        ResourceManager.addMaterials([
            new DefaultMaterial(
                'level',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('level'),
                ),
            new DefaultMaterial(
                'empty',
                ResourceManager.getShader('gui')
            ),
            new DefaultMaterial(
                'elevator',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('elevator'),
            ),
            new DefaultMaterial(
                'elevator-door',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('elevator-door'),
            ),
            new DefaultMaterial(
                'hall-door',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('hall-door'),
            ),
            new DoorPanelMaterial(),
            new DefaultMaterial(
                'lamp',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('lamp'),
            ),
            new DefaultMaterial(
                'hand',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('hand'),
            ),
            new DefaultMaterial(
                'gun',
                ResourceManager.getShader('map'),
                ResourceManager.getTexture('gun'),
            ),
            new DefaultMaterial(
                'monster',
                ResourceManager.getShader('monster'),
                ResourceManager.getTexture('monster'),
            ),
            new DefaultMaterial(
                'rectangle',
                ResourceManager.getShader('gui')
            ),
            new DefaultMaterial(
                'text',
                ResourceManager.getShader('text'),
                ResourceManager.getTexture('text'),
            ),
            new DefaultMaterial(
                'instructions',
                ResourceManager.getShader('text'),
                ResourceManager.getTexture('instructions'),
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
                name: 'hand',
                objectData: '/resources/objects/gun/hand.obj'
            },
            {
                name: 'gun-receiver',
                objectData: '/resources/objects/gun/receiver.obj'
            },
            {
                name: 'gun-slider',
                objectData: '/resources/objects/gun/slider.obj'
            },
            {
                name: 'monster',
                objectData: '/resources/objects/monster/monster.obj'
            },
            {
                name: 'rectangle',
                objectData: () => {
                    const positions = [
                        0, 0,
                        1, 0,
                        0, 1,
                        0, 1,
                        1, 0,
                        1, 1,
                    ];
                    const vao = new VAO([new VBO(new Float32Array(positions), 2, true)], 2);
                    //   vao.addEmpty(1);
                    return vao;
                }
            },
            {
                name: 'effect',
                objectData: () => {
                    const positions = [
                        -1, -1,
                        1, -1,
                        -1, 1,
                        -1, 1,
                        1, -1,
                        1, 1,
                    ];
                    const vp = [
                        0, 0,
                        1, 0,
                        0, 1,
                        0, 1,
                        1, 0,
                        1, 1,
                    ];
                    const vbo = [] as VBO[];
                    vbo.push(new VBO(new Float32Array(positions), 2, true));
                    vbo.push(new VBO(new Float32Array(vp), 2, true));
                    const vao = new VAO(vbo, 2);
                    //   vao.addEmpty(1);
                    return vao;
                }
            }
        ])
            .forEachVAO((vao) => {
                vao.create();
            })

        const fadingRenderer = new FadingRenderer(this._camera);

        const scene1 = new MainScene(this._camera, fadingRenderer)

        const mapRenderer = new MapRenderer(this._camera);
        scene1.getRenderStrategy().add(mapRenderer)
        const monsterRenderer = new MonsterRenderer(this._camera);
        scene1.getRenderStrategy().add(monsterRenderer)
        const playerRenderer = new PlayerRenderer(this._camera);
        scene1.getRenderStrategy().add(playerRenderer)
        const guiRenderer = this._guiRenderer = new GuiRenderer(this._camera);
        scene1.getRenderStrategy().add(guiRenderer)

        scene1.init(this.getUpdater())

        //scene1.getProperties().gravity = 0

        this.getSceneManager().add(scene1, true)

        playerRenderer.setPlayer(
            scene1.get('player') as Player,
            scene1.get('gun') as Gun
        )
        monsterRenderer.setPlayer(scene1.get('player') as Player)

        /* Credits Scene */
        this.getSceneManager().add(new CreditsMenu(guiRenderer, fadingRenderer));
        
        /* GameOver Scene */
        this.getSceneManager().add(new GameOverScene(guiRenderer, fadingRenderer));

        /* Loading Scene */
        this.getSceneManager().add(new LoadingScene(guiRenderer, fadingRenderer));

        /* End Scene */
        this.getSceneManager().add(new EndScene(guiRenderer, fadingRenderer));

        /* Instructions Scene */
        this.getSceneManager().add(new InstructionsMenu(guiRenderer, fadingRenderer));

        /* Menu Scene */
        this.getSceneManager().add(new MainMenu(guiRenderer, fadingRenderer), true);

        const loading = setInterval(() => {
            if(
                ResourceManager.anyTexture(texture => !texture.isCreated()) ||
                ResourceManager.anySound(sound => !sound.isLoaded())
            ) {
                return;
            }
            Event.trigger("loadScene", this.getSceneManager().getActive());
            clearInterval(loading)
        }, 500);
        
    }

    public update(time: number, delta: number) {
        super.update(time, delta);
        this._camera.update(delta)
    }

    public render(delta: number) {
        super.render(delta);
    }

}
export default GameTest
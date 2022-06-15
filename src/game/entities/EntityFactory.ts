import { Vector3 } from '@math.gl/core';
import Material from '@razor/appearance/material/Material';
import Entity from '@razor/core/entities/Entity';
import ResourceManager from '@razor/core/ResourceManager';
import Scene from '@razor/core/scenes/Scene';
import SceneManager from '@razor/core/scenes/SceneManager';
import OBJLoader, { HitboxesJSON } from '@razor/loader/OBJLoader';
import Orientation from '@razor/math/Orientation';
import EdgeHitbox from '@razor/physics/hitboxes/EdgeHitbox';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import RenderStrategy from '@razor/renderer/RenderStrategy';
import FileUtils from '@razor/utils/FileUtils';
import Lamp from './Lamp';
import MapEntity from './MapEntity';
import HallDoorEntity from './HallDoorEntity';
import SimpleEntity from './SimpleEntity';
import DoorPanelEntity from './DoorPanelEntity';
import Transform from '@razor/math/Transform';
import Monster from './monster/Monster';
import Player from './player/Player';
import { IEntityWithLight } from './IEntityWithLight';

class EntityFactory {

  private _scene: Scene
  private _renderStrategy: RenderStrategy

  public constructor(scene: Scene, renderStrategy: RenderStrategy) {
    this._scene = scene;
    this._renderStrategy = renderStrategy;
  }

  public load(): void {
    this._loadMap()
    this._loadMonsters()
    this._configureEntities()
  }

  private _loadMonsters(): void {
    interface MonsterImportJSON {
      [name: string]: {
        translation: {
          x: number
          y: number
          z: number
        }
      }
    }

    FileUtils.load('/resources/monsters.json',
      (data) => {

        const entities: MonsterImportJSON = JSON.parse(data)

        Object.keys(entities).forEach(key => {
          const data = entities[key]

          const entity = new Monster(
            key, 
            this._renderStrategy.get('monster-renderer'),
            this._scene.get('player') as Player
          )

          entity.getTransform().setTranslation(new Vector3(
            data.translation.x,
            data.translation.y,
            data.translation.z,
          ))
          entity.getTransform().setScale(new Vector3(1, 2, 1))
          entity.getHitbox().disableCollision(true)

          this._scene.add(entity)

        })


      },
      function onError(err) {
        console.error('Could not import monsters from json: ', err);
      },
    );
  }

  private _loadMap(): void {
    interface EntityImportJSON {
      [name: string]: {
        translation: {
          x: number
          y: number
          z: number
        },
        rotation: {
          x: number
          y: number
          z: number
        },
        scale: {
          x: number
          y: number
          z: number
        },
        options?: {
          [key: string] : any
        }
      }
    }

    const hitboxes = new OBJLoader().loadHitboxes('/resources/hitboxes.json')

    FileUtils.load('/resources/entities.json',
      (data) => {

        const entities: EntityImportJSON = JSON.parse(data)

        Object.keys(entities).forEach(key => {
          const data = entities[key]

          const vaoName = ((): string => {
            for(let i = key.length-1; i >= 0; i--) {
              if(key[i] === '_') {
                return key.substring(0, i)
              }
            }
            return '';
          })();

          const entity = this._createEntity(key, vaoName, hitboxes,data.options)

          entity.getTransform().setTranslation(new Vector3(
            data.translation.x,
            data.translation.y,
            data.translation.z,
          ))
          entity.getTransform().setRotation(new Orientation(
            data.rotation.x,
            data.rotation.y,
            data.rotation.z,
          ))
          entity.getTransform().setScale(new Vector3(
            data.scale.x,
            data.scale.y,
            data.scale.z,
          ))

          this._scene.add(entity)

        })


      },
      function onError(err) {
        console.error('Could not import entities from json: ', err);
      },
    );
    
  } 

  private _createEntity(name: string, vao: string, hitboxes: HitboxesJSON,options?: any): Entity {

    switch (vao) {
      case 'lamp':
        return new Lamp(
          name, 
          this._renderStrategy.get('renderer1'),
          new Vector3(1, 0, 0)
        )
      case 'hall-door':
        let transform;
        if(options?.camera){
          transform = new Transform(options.camera.translation,new Orientation(options.camera.rotation.x,options.camera.rotation.y,options.camera.rotation.z))
        }
        return new HallDoorEntity(
          name,
          this._getHitbox(vao, hitboxes),
          this._renderStrategy.get('renderer1'),
          transform
        )
      case 'door-panel':
        return new DoorPanelEntity(
          name,
          this._getHitbox(vao, hitboxes),
          this._renderStrategy.get('renderer1')
        )
      default:
    }

    return new MapEntity(
      name,
      this._getHitbox(vao, hitboxes),
      1,
      ResourceManager.getVAO(vao), 
      this._getMaterial(vao),
      this._renderStrategy.get('renderer1')
    )
  }

  private _getMaterial(object: string): Material {
    switch (object) {
      case 'hall':
      case 'level-2':
          return ResourceManager.getMaterial('level')
      default:
    }
    return ResourceManager.getMaterial(object)
  }


  private _configureEntities(): void {

    (this._scene.get('lamp_2') as Lamp).color = new Vector3(1, 1, 1);
    (this._scene.get('lamp_33') as Lamp).color = new Vector3(1, 1, 1)

    this._distributeClosestLampsForStaticEntities()

  }

  private _distributeClosestLampsForStaticEntities() {

    const lamps: Lamp[] = []

    this._scene.forEach((entity: Entity) => {
      if(entity instanceof Lamp) {
        lamps.push(entity)
      }
    })

    this._scene.forEach((entity: Entity) => {
      if(entity instanceof MapEntity || entity instanceof Monster) {
        (entity as IEntityWithLight).setLampList(this.get5ClosestLamps(entity, lamps))
      }
    })

  }

  public get5ClosestLamps(
    entity: Entity, 
    lamps: Lamp[], 
    position: Vector3 = entity.getTransform().getTranslation()
  ): Lamp[] {
    return Array.from(lamps).sort((a, b) => {
      const distanceA = position.distanceTo(a.getTransform().getTranslation())
      const distanceB = position.distanceTo(b.getTransform().getTranslation())
      if(distanceA > distanceB) return 1;
      if(distanceA < distanceB) return -1;
      return 0;
    }).slice(0, 5);
  }

  private _getHitbox(vao: string, hitboxes: HitboxesJSON): Hitbox {
    return new EdgeHitbox(
      hitboxes.edge[vao].vertices,
      hitboxes.edge[vao].indices
    )

  }

}

export default EntityFactory
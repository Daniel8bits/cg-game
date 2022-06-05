import { Vector3 } from '@math.gl/core';
import Material from '@razor/appearance/material/Material';
import Entity from '@razor/core/entities/Entity';
import ResourceManager from '@razor/core/ResourceManager';
import SceneManager from '@razor/core/scenes/SceneManager';
import OBJLoader, { HitboxesJSON } from '@razor/loader/OBJLoader';
import Orientation from '@razor/math/Orientation';
import EdgeHitbox from '@razor/physics/hitboxes/EdgeHitbox';
import Hitbox from '@razor/physics/hitboxes/HitBox';
import RenderStrategy from '@razor/renderer/RenderStrategy';
import FileUtils from '@razor/utils/FileUtils';
import Lamp from './Lamp';
import MapEntity from './MapEntity';
import SimpleEntity from './SimpleEntity';

class EntityFactory {

  private _sceneManager: SceneManager
  private _renderStrategy: RenderStrategy

  public constructor(sceneManager: SceneManager, renderStrategy: RenderStrategy) {
    this._sceneManager = sceneManager;
    this._renderStrategy = renderStrategy;
  }

  public load(): void {
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

          const entity = this._createEntity(key, vaoName, hitboxes)

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

          this._sceneManager.getActive().add(entity)

        })


      },
      function onError(err) {
        console.error('Could not import entities from json: ', err);
      },
    );

    this._configureEntities()
    
  } 

  private _createEntity(name: string, vao: string, hitboxes: HitboxesJSON): Entity {

    switch (vao) {
      case 'lamp':
          return new Lamp(
            name, 
            this._renderStrategy.get('renderer1'),
            new Vector3(1, 0, 0)
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

    (this._sceneManager.getActive().get('lamp_2') as Lamp).color = new Vector3(1, 1, 1);
    (this._sceneManager.getActive().get('lamp_33') as Lamp).color = new Vector3(1, 1, 1)

    this._distributeClosestLampsForStaticEntities()

  }

  private _distributeClosestLampsForStaticEntities() {

    const lamps: Lamp[] = []

    this._sceneManager.getActive().forEach((entity: Entity) => {
      if(entity instanceof Lamp) {
        lamps.push(entity)
      }
    })

    this._sceneManager.getActive().forEach((entity: Entity) => {
      if(entity instanceof MapEntity) {

        const position = entity.getTransform().getTranslation()
        
        const closestLamps = Array.from(lamps).sort((a, b) => {
          const distanceA = position.distanceTo(a.getTransform().getTranslation())
          const distanceB = position.distanceTo(b.getTransform().getTranslation())
          if(distanceA > distanceB) return 1;
          if(distanceA < distanceB) return -1;
          return 0;
        }).slice(0, 5);

        (entity as MapEntity).setLampList(closestLamps)

      }
    })

  }

  private _getHitbox(vao: string, hitboxes: HitboxesJSON): Hitbox {
    return new EdgeHitbox(
      hitboxes.edge[vao].vertices,
      hitboxes.edge[vao].indices
    )

  }

}

export default EntityFactory
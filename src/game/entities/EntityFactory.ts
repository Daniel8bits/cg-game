import { Vector3 } from '@math.gl/core';
import Material from '@razor/appearance/material/Material';
import Entity from '@razor/core/Entity';
import ResourceManager from '@razor/core/ResourceManager';
import SceneManager from '@razor/core/SceneManager';
import Orientation from '@razor/math/Orientation';
import RenderStrategy from '@razor/renderer/RenderStrategy';
import FileUtils from '@razor/utils/FileUtils';
import Lamp from './Lamp';
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

          const entity = this._createEntity(key, vaoName)

          entity.getTransform().setTranslation(new Vector3(
            data.translation.x,
            data.translation.y,
            data.translation.z,
          ))
          entity.getTransform().setRotation(new Orientation(
            data.rotation.x,
            data.rotation.y,
            //data.rotation.y < 0 ? (data.rotation.y*2 - 180) : data.rotation.y*2,
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

    (this._sceneManager.getActive().get('lamp_2') as Lamp).color = new Vector3(1, 1, 1);
    (this._sceneManager.getActive().get('lamp_33') as Lamp).color = new Vector3(1, 1, 1)
    
  } 

  private _createEntity(name: string, vao: string): Entity {

    switch (vao) {
      case 'lamp':
          return new Lamp(
            name, 
            this._renderStrategy.get('renderer1'),
            new Vector3(1, 0, 0)
          )
      default:
    }

    return new SimpleEntity(
      name,
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

}

export default EntityFactory
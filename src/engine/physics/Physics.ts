import Scene from '../core/Scene'

function Physics(scene: (new () => Scene)): (new () => Scene) {
  return class extends scene {

    public update(time: number, delta: number): void {
      super.update(time, delta);


    }

  }
}


export default Physics
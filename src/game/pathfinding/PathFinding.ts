import { Vector2 } from "@math.gl/core"
import FileUtils from "@razor/utils/FileUtils"
import PathNode from "./PathNode"


class PathFinding {

  private _openNodes: Map<string, PathNode>
  private _closedNodes: Map<string, PathNode>

  public constructor() {
    this._openNodes = new Map<string, PathNode>()
    this._closedNodes = new Map<string, PathNode>()
  }

  public find(origin: PathNode, destiny: PathNode): void {

    let current: PathNode

    this._openNodes.set(origin.getName(), origin)

    while(this._openNodes.size > 0) {
      
      current = this._popLowestCostNode(this._openNodes)
      this._closedNodes.set(current.getName(), current)

      if(current === destiny) break;

      current.getNeighbours().forEach(neighbour => {
        if(this._closedNodes.has(neighbour.getName())) {
          return;
        }

        const notInOpen = !this._openNodes.has(neighbour.getName())

        const costToNeighbour = current.getG() + current.distanceTo(neighbour)

        if(notInOpen || costToNeighbour < neighbour.getG()) {
          neighbour.setG(costToNeighbour)
          neighbour.setPath(current)

          if(notInOpen) {
            neighbour.setH(neighbour.distanceTo(destiny))
            this._openNodes.has(neighbour.getName())
          }
        }

      })

    }

  }

  private _popLowestCostNode(nodeList: Map<string, PathNode>): PathNode {
    let smaller: PathNode
    let key: string
    nodeList.forEach((node, index) => {
      if(
        !smaller || 
        smaller.getF() > node.getF() || 
        (smaller.getF() === node.getF() && smaller.getH() > node.getH())
      ) {
        smaller = node
        key = index
      }
    })
    nodeList.delete(key)
    return smaller
  }

  public loadNodes(): void {

    interface NodesImportJSON {
      [name: string]: {
        translation: {
          x: number
          y: number
          z: number
        }
      }
    }

    FileUtils.load(
      '/resources/nodes.json', 
      function onSuccess(file) {
        const data: NodesImportJSON = JSON.parse(file)

        

      },
      function onError(err) {
        throw new Error(`Error trying to load nodes.\n ${err}`);
      },
    )

  }



}

export default PathFinding
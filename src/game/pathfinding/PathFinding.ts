import { Vector2 } from "@math.gl/core"
import DynamicEntity from "@razor/core/entities/DynamicEntity"
import Scene from "@razor/core/scenes/Scene"
import FileUtils from "@razor/utils/FileUtils"
import Monster from "../entities/monster/Monster"
import Player from "../entities/player/Player"
import EntityNode from "./EntityNode"
import PathNode from "./PathNode"

interface NearestNodes {
  firstClosestNode: PathNode
  //secondClosestNode: PathNode
  //thirdClosestNode: PathNode

  firstClosestNodeDistance: number
  //secondClosestNodeDistance: number
  //thirdClosestNodeDistance: number
}

class PathFinding {

  private _nodes: Map<string, PathNode>

  private _openNodes: Map<string, PathNode>
  private _closedNodes: Map<string, PathNode>

  private _scene: Scene
  private _player: Player

  private _playerNode: EntityNode
  private _monsterNodes: Map<string, EntityNode>

  public constructor(scene: Scene, player: Player) {
    this._nodes = new Map<string, PathNode>()
    this._openNodes = new Map<string, PathNode>()
    this._closedNodes = new Map<string, PathNode>()
    this._scene = scene
    this._player = player
    this._playerNode = new EntityNode(player)

    // for a while
    this._nodes.set(this._playerNode.getName(), this._playerNode)
    this._monsterNodes = new Map<string, EntityNode>()//new EntityNode(scene.get('m2') as DynamicEntity)
    
    scene
      .filterVisible(entity => entity instanceof Monster)
      .forEach(monster => {
        const monsterNode = new EntityNode(monster as DynamicEntity)
        this._monsterNodes.set(monster.getName(), monsterNode)
        //this._nodes.set(monster.getName(), monsterNode)
      })
    
    
  }
  

  public find(monster: Monster): PathNode[] {

    const origin = this._monsterNodes.get(monster.getName())//monster
    const destiny = this._playerNode

    this._nodes.set(origin.getName(), origin)

    this._clearOldPath()
    this._connectNearestNodesToMonster(origin)
    this._openNodes.clear()
    this._closedNodes.clear()

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
            this._openNodes.set(neighbour.getName(), neighbour)
          }
        }

      })

    }

    this._nodes.delete(origin.getName())

    return this._getPath()

  }

  private _getPath(): PathNode[] {
    const path: PathNode[] = []
    let current: PathNode = this._playerNode
    do {
      path.push(current)
      current = current.getPath()
    } while(current)
    path.pop()
    return path.reverse()
  }

  private _clearOldPath(): void {
    this._nodes.forEach(node => {
      node.setPath(null)
    })
  }

  public connectNearestNodesToPlayer(): void {
    this._clearOldNearestNodes(this._playerNode)
    const nearest = this._findNearest(this._playerNode)
    this._playerNode.getNeighbours().set(nearest.firstClosestNode.getName(), nearest.firstClosestNode)
    nearest.firstClosestNode.getNeighbours().set(this._playerNode.getName(), this._playerNode)
  }

  private _connectNearestNodesToMonster(monsterNode: EntityNode): void {
    this._clearOldNearestNodes(monsterNode)
    const nearest = this._findNearest(monsterNode)
    monsterNode.getNeighbours().set(nearest.firstClosestNode.getName(), nearest.firstClosestNode)
  }

  private _findNearest(entityNode: EntityNode): NearestNodes {

    let firstClosestNode: PathNode

    let firstClosestNodeDistance: number

    const updateFirst = (node: PathNode, distance: number) => {
      firstClosestNode = node
      firstClosestNodeDistance = distance
    }

    this._nodes.forEach(node => {
      if(node.getName() === entityNode.getName()) {
        return;
      }
      const distance = entityNode.distanceTo(node)
      if(!firstClosestNode || distance < firstClosestNodeDistance) {
        updateFirst(node, distance)
      }
    })

    return {
      firstClosestNode,
      firstClosestNodeDistance,
    }

  }

  private _clearOldNearestNodes(entityNode: EntityNode): void {
    entityNode.getNeighbours().forEach(neighbour => {
      neighbour.getNeighbours().delete(entityNode.getName())
    })
    entityNode.getNeighbours().clear()
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
      (file) => {
        const data: NodesImportJSON = JSON.parse(file)

        Object.keys(data).forEach(nodeName => {
          
          const position = data[nodeName].translation
          const node = new PathNode(nodeName, new Vector2(position.x, position.z))
          this._nodes.set(node.getName(), node)

        })

        this._connectNodes()

      },
      function onError(err) {
        throw new Error(`Error trying to load nodes.\n ${err}`);
      },
    )

  }

  private _connectNodes(): void {

    const nodeMapping = {
      0: [1],
      1: [0, 2, 3],
      2: [1, 9],
      3: [1, 4],
      4: [3, 5],
      5: [4, 6, 17],
      6: [5, 7],
      7: [6, 8],
      8: [7, 9, 10],
      9: [2, 8],
      10: [8, 11, 12],
      11: [10, 14],
      12: [10, 13],
      13: [12, 16],
      14: [11, 15],
      15: [14, 16],
      16: [15, 13],
      17: [5, 18, 19],
      18: [17, 25],
      19: [17, 20],
      20: [19, 21],
      21: [20, 22, 33],
      22: [21, 23],
      23: [22, 24],
      24: [23, 25, 26],
      25: [18, 24],
      26: [24, 27, 28],
      27: [26, 32],
      28: [26, 29],
      29: [28, 30],
      30: [29, 31],
      31: [30, 32],
      32: [31, 27],
      33: [21, 34, 35],
      34: [33, 40],
      35: [33, 36],
      36: [35, 37],
      37: [36, 38, 49],
      38: [37, 39],
      39: [38, 40],
      40: [39, 41, 42],
      41: [34, 40],
      42: [40, 43, 48],
      43: [42, 44],
      44: [43, 45],
      45: [44, 46],
      46: [45, 47],
      47: [46, 48],
      48: [47, 42],
      49: [37]
    }

    Object.keys(nodeMapping).forEach((nodeId => {
      const node = this._nodes.get('node_'+nodeId)
      nodeMapping[nodeId].forEach((neighbourId: number) => {
        const neighbourName = 'node_'+neighbourId
        node.getNeighbours().set(neighbourName, this._nodes.get(neighbourName))
      })
    }))

  }

  public getNodes(): Map<string, PathNode> {
    return this._nodes
  }

}

export default PathFinding
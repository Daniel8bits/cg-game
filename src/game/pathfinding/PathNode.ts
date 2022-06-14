import { Vector2 } from "@math.gl/core"


class PathNode {

  private _name: string

  // distance from origin
  private _g: number
  // distance from destiny
  private _h: number

  private _neighbours: Map<string, PathNode>
  private _marked: boolean
  private _position: Vector2
  private _path: PathNode

  public constructor(name: string, position: Vector2) {
    this._name = name
    this._position = position
    this._g = 0
    this._h = 0
    this._neighbours = new Map<string, PathNode>()
    this._marked = false
    this._path = null
  }

  public distanceTo(node: PathNode): number {
    return this._position.distanceTo(node.getPosition())
  }

  public calculateG(originPosition: Vector2): void {
    this._g = originPosition.distanceTo(this._position)
  }

  public setG(g: number): void {
    this._g = g
  }
  
  public getG(): number {
    return this._g
  }

  public calculateH(destinyPosition: Vector2): void {
    this._h = destinyPosition.distanceTo(this._position)
  }

  public setH(h: number): void {
    this._h = h
  }

  public getH(): number {
    return this._h
  }

  public getF(): number {
    return this._g + this._h
  }

  public getNeighbours(): Map<string, PathNode> {
    return this._neighbours
  }

  public setMarked(marked: boolean): void {
    this._marked = marked
  }

  public isMarked(): boolean {
    return this._marked
  }

  public setPosition(position: Vector2): void {
    this._position = position
  }

  public getPosition(): Vector2 {
    return this._position
  }

  public setPath(path: PathNode): void {
    this._path = path
  }

  public getPath(): PathNode {
    return this._path
  }

  public getName(): string {
    return this._name
  }

}

export default PathNode
import IUpdatable from "./IUpdatable";

class Updater {

  /* All entities */
  private _updatables: Map<string, IUpdatable>;
  /* Only visible entities */
  private _enabled: Map<string, IUpdatable>;
  /* Only hidden entities */
  private _disabled: Map<string, IUpdatable>;

  public constructor() {
    this._updatables = new Map<string, IUpdatable>();
    this._enabled = new Map<string, IUpdatable>();
    this._disabled = new Map<string, IUpdatable>();
  }

  public update(time: number, delta: number): void {
    this.forEachEnabled((entity) => {
      entity.update(time, delta, this);
    })
  }

  /**
   * Adds a new entity, visible by default
   * @param updatable entity or the name of the entity to be added
   * @param visible default visibility
   */
  public add(updatable: IUpdatable, visible: boolean = true): Updater {
    this._validate(updatable, this._updatables);
    this._updatables.set(updatable.getName(), updatable);
    if(visible) {
      this._enabled.set(updatable.getName(), updatable);
    }
    else { 
      this._disabled.set(updatable.getName(), updatable);
    }
    return this
  }

  /**
   * Remove an existent entity
   * @param updatable entity or the name of the entity to be removed
   */
  public remove(updatable: IUpdatable|string): Updater {
    const key: string = this._validate(updatable, this._updatables, false);
    this._updatables.delete(key);
    if(this._enabled.has(key)) {
      this._enabled.delete(key);
    }
    if(this._disabled.has(key)) {
      this._disabled.delete(key);
    }
    return this
  }

  /**
   * Sets the visibility of an existent entity
   * @param updatable entity or the name of the entity to have the visibility changed
   */
  public enable(updatable: IUpdatable|string): Updater|never {
    const key: string = this._validate(updatable, this._updatables, false);
    if(!this._enabled.has(key)) {
      this._enabled.set(key, this._disabled.get(key));
      this._disabled.delete(key);
    }
    return this
  }

  /**
   * Sets the visibility of an existent entity
   * @param updatable entity or the name of the entity to have the visibility changed
   */
  public disable(updatable: IUpdatable|string): Updater|never {
    const key: string = this._validate(updatable, this._updatables, false);
    if(!this._disabled.has(key)) {
      this._disabled.set(key, this._enabled.get(key));
      this._enabled.delete(key);
    }
    return this
  }
  

  /**
   * Returns an existent entity
   * @param name the name of the entity to be returned
   */
  public get(name: string): IUpdatable {
    this._validate(name, this._updatables, false);
    return this._updatables.get(name);
  }

  /**
   * Returns the keys of all entities
   */
  public getKeys(): string[] {
    return this._keys(this._updatables);
  }

  /**
   * Returns the keys of only the visible entities
   */
  public getKeysFromEnabled(): string[] {
    return this._keys(this._enabled);
  }

  /**
   * Returns the keys of only the hidden entities
   */
  public getKeysFromDisabled(): string[] {
    return this._keys(this._disabled);
  }

  /**
   * Common behavior pattern for 'getKeys' methods
   */
  private _keys = (map: Map<string, IUpdatable>): string[] => [...map.keys()];

  /**
   * Iterates all entities
   * @param fn do something with each entity
   */
  public forEach(fn: (updatable: IUpdatable, key?: string) => void): Updater {
    this._forEach(fn, this._updatables);
    return this
  }

  /**
   * Iterates visible entities
   * @param fn do something with each entity
   */
  public forEachEnabled(fn: (updatable: IUpdatable, key?: string) => void): Updater {
    this._forEach(fn, this._enabled);
    return this
  }
  /**
   * Iterates hidden entities
   * @param fn do something with each entity
   */
  public forEachDisabled(fn: (updatable: IUpdatable, key?: string) => void): Updater {
    this._forEach(fn, this._disabled);
    return this
  }

  /**
   * Common behavior pattern for 'forEach' methods
   * @param fn do something with each entity
   * @param map map to be iterated
   */
  private _forEach(fn: (updatable: IUpdatable, key?: string) => void, map: Map<string, IUpdatable>): void {
    map.forEach(fn)
  }

  /**
   * Checks if there is a given entity
   * @param updatable entity or the name of the entity to be checked
   */
  public has(updatable: IUpdatable|string): boolean {
    return this._has(updatable, this._updatables);
  }

  /**
   * Checks if there is a given entity among the visibles
   * @param updatable entity or the name of the entity to be checked
   */
  public hasInEnabled(updatable: IUpdatable|string): boolean {
    return this._has(updatable, this._enabled);
  }

  /**
   * Checks if there is a given entity among the hiddens
   * @param updatable entity or the name of the entity to be checked
   */
  public hasInDisabled(updatable: IUpdatable|string): boolean {
    return this._has(updatable, this._disabled);
  }

  /**
   * Common behavior pattern for 'has' methods
   * @param updatable entity or the name of the entity to be checked
   * @param map map to be iterated
   */
  private _has(updatable: IUpdatable|string, map: Map<string, IUpdatable>): boolean {
    const name = this._getName(updatable);
    return map.has(name);
  }

  public filterEnabled(predicate: (updatable: IUpdatable) => boolean): IUpdatable[] {
    const filterResult = []
    this._enabled.forEach((updatable) => {
      if(predicate(updatable)) {
        filterResult.push(updatable)
      }
    })
    return filterResult
  }

  /**
   * Validates the existence or not of a given entity in a given map and
   * returns the entity key in case of success.
   * Fail case is defined by 'exists' param.
   * @param updatable entity or the name of the entity to be validated
   * @param map map where entity should exists or not
   * @param exists fail case of the validation
   * @returns the entity name
   */
  private _validate(updatable: IUpdatable|string, map: Map<string, IUpdatable>, exists: boolean = true): string|never {
    const name = this._getName(updatable);
    if(exists && map.has(name)) {
      throw new Error(`Entity ${name} already exists!`);
    }
    if(!exists && !map.has(name)) {
      throw new Error(`Entity ${name} does not exists!`);
    }
    return name;
  }

  /**
   * Resolves the entity name
   * @param updatable entity or the name of the entity to be resolved
   */
  private _getName(updatable: IUpdatable|string): string {
    return typeof updatable !== 'string' ? updatable.getName() : updatable;
  }

  public get entities() : Map<string, IUpdatable> {
    return this._updatables;
  }

}

export default Updater;
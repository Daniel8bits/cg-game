import { Vector3 } from "@math.gl/core"
import Transform from "@razor/math/Transform"

interface SoundOptions {
    loop?: boolean
    autoplay?: boolean
    volume?: number
}

export interface SoundType {
  name: string,
  pathname: string,
  options?: SoundOptions
}

class Sound {

  private name : string;
  private _audio: HTMLAudioElement;
  private _origin?: Transform;
  private _listener: Transform;

  constructor(name: string, pathname: string, options?: SoundOptions) {
    this.name = name;
    this._audio = new Audio(pathname);
    this._audio.loop = options?.loop ?? false;
    this._audio.autoplay = options?.autoplay ?? false;
    this._audio.volume = (options?.volume ?? 100)/100;
    this._audio.pause();
  }
  
  public setOrigin(origin: Transform){
    this._origin = origin;
  }

  public getOrigin(): Transform{
    return this._origin;
  }

  public setListener(listener: Transform){
    this._listener = listener;
  }

  public getListener(): Transform{
    return this._listener;
  }

  public play(loop: boolean = false, force: boolean = false): void {
    if(!force && !this._audio.paused) return;
    if(force){
      this.pause()
    }
    this._audio.loop = loop;
    this._audio.play()
      .then(() => {
        const clear = setInterval(() => {
          if(this._audio.paused) {
            this._audio.currentTime = 0;
            clearInterval(clear);
          }
          if(this._origin && this._listener) {
            const vectorDistance = this._origin.getTranslation().subtract(this._listener.getTranslation());
            const distanceLength = Math.sqrt(Math.pow(vectorDistance[0],2) + Math.pow(vectorDistance[1],2) + Math.pow(vectorDistance[2],2))
            this._audio.volume = 1.0 / (1.0 + 0.022 * distanceLength + 0.0019 * (distanceLength * distanceLength));
          }
        }, 1000)
      })
  }

  public pause(): void {
    this._audio.pause();
    this._audio.currentTime = 0;
  }

  public getName(): string {
    return this.name;
  }

}

export default Sound;
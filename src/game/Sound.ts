import { Vector3 } from "@math.gl/core"
import Camera from "@razor/core/Camera"

type SoundList = {
    [key: string]: Sound
}

type SoundOptions = {
    loop?: boolean
    autoplay?: boolean
    volume?: number
}
class Sound {

    readonly name : string;
    private _audio: HTMLAudioElement;
    private _translation?: Vector3;

    private static Sounds: SoundList = {}
    constructor(name: string, pathname: string,options?: SoundOptions) {
        Sound.Sounds[name] = this;
        this.name = name;
        this._audio = new Audio(pathname);
        this._audio.loop = options?.loop ?? false;
        this._audio.autoplay = options?.autoplay ?? false;
        this._audio.volume = (options?.volume ?? 100)/100;
        this._audio.pause();
    }
    
    public setTranslation(translation : Vector3){
        this._translation = translation;
    }

    public getTranslation(): Vector3{
        return this._translation;
    }

    public play(loop = false, resetTime = -1,translation? : Vector3) {
        if(!this._audio.paused) return;
        //this._audio.pause();
        //this._audio.currentTime = 0;
        this._audio.loop = loop;
        this._audio.play();
        if(translation){
            const clear = setInterval(() => {
                if(this._audio.paused) clearInterval(clear);
                const vectorDistance = translation.subtract(Camera.Main.getTransform().getTranslation());
                const distanceLength = Math.sqrt(Math.pow(vectorDistance[0],2) + Math.pow(vectorDistance[1],2) + Math.pow(vectorDistance[2],2))
                this._audio.volume = 1.0 / (1.0 + 0.022 * distanceLength + 0.0019 * (distanceLength * distanceLength));

            },1000)
        }
        if (resetTime != -1) {
            while (!this._audio.paused) {
                if (this._audio.currentTime >= resetTime) {
                    this._audio.currentTime = 0;
                }
            }
        }
    }

    public pause() {
        this._audio.pause();
        this._audio.currentTime = 0;
    }

    public static Find(name: string): Sound {
        return Sound.Sounds[name];
    }
}

export default Sound;
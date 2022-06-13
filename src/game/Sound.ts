type SoundList = {
    [key: string]: Sound
}

type SoundOptions = {
    loop?: boolean
    autoplay?: boolean
    volume?: number
}
class Sound {

    private _audio: HTMLAudioElement;

    private static Sounds: SoundList = {}
    constructor(name: string, pathname: string,options?: SoundOptions) {
        Sound.Sounds[name] = this;
        this._audio = new Audio(pathname);
        this._audio.loop = options?.loop ?? false;
        this._audio.autoplay = options?.autoplay ?? false;
        this._audio.volume = (options?.volume ?? 100)/100;
    }

    public play(loop = false, resetTime = -1) {
        //this._audio.pause();
        //this._audio.currentTime = 0;
        this._audio.loop = loop;
        this._audio.play();
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
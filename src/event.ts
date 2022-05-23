interface FN{
    (...args) : void
}
class Event{

    private static events = new Map<string,FN[]>(); 

    static trigger(event,...args){
        const events = this.events.get(event);
        if(events){
            events.map((item) => {
                item.apply(this,args);
            })
        }
    }

    static on(name: string, callback: FN){
        if(this.events.has(name)){
            this.events.get(name).push(callback);
        }else{
            this.events.set(name,[callback]);
        }
    }
}

export default Event;


export class Especialidad {
    _id?: string;
    nombreEsp: String;
    activa?: boolean;
    
    constructor(nombreEsp:String, activa: boolean = true){
        this.nombreEsp=nombreEsp;
        this.activa = activa;
    }
}

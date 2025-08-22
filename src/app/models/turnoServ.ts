import { Especialidad } from "./especialidad";


export class TurnoServ {
    _id?: string;
    medico_id?: any;
    paciente_id?: any
    fecha?: Date;
    especialidad_id?:any;
    obras_sociales?:Array<any>;
    estado?:String;
    consultorio?:String;
    duracion?:number;
    nombreTerminal?:String;
    dniTerminal?:number;
    observacion?:String;
    constructor(medico_id:any,fecha:Date,especialidad_id:any,estado:String,consultorio:String,duracion:number){
        this.medico_id=medico_id;
        this.fecha=fecha;
        this.especialidad_id=especialidad_id;
        this.estado=estado;
        this.consultorio=consultorio;
        this.duracion=duracion;
    }
}

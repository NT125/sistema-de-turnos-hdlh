import { Especialidad } from "./especialidad";
import {Medico} from "./medico";
import { ObraSocial } from "./obraSocial";
import {Paciente } from "./paciente";

export class Turno {
    _id?: string;
    medico_id: Medico;
    paciente_id?: Paciente;
    fecha: Date;
    especialidad_id:Especialidad;
    obras_sociales:Array<ObraSocial>;
    estado:String;
    consultorio:String;
    duracion:Number;
    nombreTerminal?:String;
    dniTerminal?:String;
    observacion?:String;
    constructor(medico_id:Medico,paciente_id:Paciente,fecha:Date,especialidad_id:Especialidad,obras_sociales:Array<ObraSocial>,estado:String,consultorio:String,duracion:Number){
        this.medico_id=medico_id;
        this.paciente_id=paciente_id;
        this.fecha=fecha;
        this.especialidad_id=especialidad_id;
        this.obras_sociales=obras_sociales;
        this.estado=estado;
        this.consultorio=consultorio;
        this.duracion=duracion;
    }
}

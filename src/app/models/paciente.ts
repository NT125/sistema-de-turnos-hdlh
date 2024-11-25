export class Paciente {
    _id?: string;
    dni: number;
    nombre: String;
    telefono: String;
    passw?: String;
    strikes:number;
    rol?:String;
    email?:String;
    constructor(dni:number,telefono:String,nombre:String,strikes:number){
        this.dni=dni;
        this.telefono=telefono; 
        this.nombre=nombre;
       
        this.strikes=strikes;
    }
    
}

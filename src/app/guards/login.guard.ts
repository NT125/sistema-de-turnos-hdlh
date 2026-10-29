import { Router } from "@angular/router";
import {inject} from "@angular/core";
export const loginGuardAdmin=()=>{
    const router = inject(Router);
    if(sessionStorage.getItem('token') && sessionStorage.getItem('rol')=='admin'){
        return true;
    }
    else{
        router.navigate(['/']);
        return false;
    }
    
}
export const loginGuardTerminal=()=>{
    const router = inject(Router);
    if(sessionStorage.getItem('token') && sessionStorage.getItem('rol')=='terminal'){
        
        
        return true;
        
    }
    else{
        router.navigate(['/']);
        return false;
    }
    
}
export const loginGuardSecretaria=()=>{
    const router = inject(Router);
    if(sessionStorage.getItem('token') && (sessionStorage.getItem('rol')=='secretaria'|| sessionStorage.getItem('rol')=='admin')){
        return true;
    }
    else{
        router.navigate(['/']);
        return false;
    }
    
}
export const loginGuardRecetario=()=>{
    const router = inject(Router);
    if(sessionStorage.getItem('token') && (sessionStorage.getItem('rol')=='recetario'|| sessionStorage.getItem('rol')=='admin')){
        return true;
    }
    else{
        router.navigate(['/']);
        return false;
    }
}
export const loginGuardPaciente=()=>{
    const router = inject(Router);
    if(sessionStorage.getItem('token')){
        if(Number(sessionStorage.getItem('strikes'))<=3){
         
            return true;   
        }
        router.navigate(['baneado']);
        return false;
    }
    else{
        router.navigate(['/']);
        return false;
    }
    
}
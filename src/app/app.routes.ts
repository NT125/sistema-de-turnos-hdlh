import { Routes } from '@angular/router';   
import { BodyComponent } from './components/main-page/body/body.component';
import { EsepcialidadesPageComponent } from './components/esepcialidades-page/esepcialidades-page.component'; 
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { MedicosListComponent } from './components/admin-page/medicos-list/medicos-list.component';
import { MedicoFormComponent } from './components/admin-page/medico-form/medico-form.component';
import { UsuariosListComponent } from './components/admin-page/usuarios-list/usuarios-list.component';
import { LoginComponent } from './components/login/login.component';
import { RecoverPasswordComponent } from './components/login/recover-password/recover-password.component';
import { SecretariaPageComponent } from './components/secretaria-page/secretaria-page.component';
import { FormTurnoComponent } from './components/form-turno/form-turno.component';
import { RegistroComponent } from './components/registro/registro.component';
import { FormNuevoTurnoComponent } from './components/secretaria-page/form-nuevo-turno/form-nuevo-turno.component';
import { MisTurnosComponent } from './components/mis-turnos/mis-turnos.component';
import { loginGuardAdmin, loginGuardTerminal } from './guards/login.guard';
import { loginGuardSecretaria } from './guards/login.guard';
import { loginGuardPaciente } from './guards/login.guard';
import { CambiarPasswordComponent } from './components/login/cambiar-password/cambiar-password.component';
import { BanPageComponent } from './components/main-page/ban-page/ban-page.component';
import { NewPasswordComponent } from './components/login/new-password/new-password.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { AutogestionComponent } from './components/main-page/autogestion/autogestion.component';
import { InformesPageComponent } from './components/admin-page/informes-page/informes-page.component';
import { ObrasSocialesListComponent } from './components/admin-page/obras-sociales-list/obras-sociales-list.component';
import { ObrasSocialesFormComponent } from './components/admin-page/obras-sociales-form/obras-sociales-form.component';
import { TerminosCondicionesComponent } from './components/main-page/terminos-condiciones/terminos-condiciones.component';
import { EspecialidadesListComponent } from './components/admin-page/especialidades-list/especialidades-list.component';
import { EspecialidadesFormComponent } from './components/admin-page/especialidades-form/especialidades-form.component';
import { MiPerfilComponent } from './components/main-page/mi-perfil/mi-perfil.component';
import { UsuarioFormComponent } from './components/admin-page/usuario-form/usuario-form.component';

export const routes: Routes = [
    {path: '', component:BodyComponent},
    {path: 'terminos-y-condiciones', component:TerminosCondicionesComponent},
    {path: 'admin', component:AdminPageComponent,
        canActivate:[loginGuardAdmin]
    },
    {path: 'admin/informes', component:InformesPageComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/obras-sociales', component:ObrasSocialesListComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/obras-sociales/nuevo', component:ObrasSocialesFormComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/obras-sociales/editar/:id', component:ObrasSocialesFormComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/especialidades', component:EspecialidadesListComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/especialidades/nuevo', component:EspecialidadesFormComponent, canActivate:[loginGuardAdmin]},
    {path: 'admin/especialidades/editar/:id', component:EspecialidadesFormComponent, canActivate:[loginGuardAdmin]},
    {path: 'especialidades', component:EsepcialidadesPageComponent,canActivate:[loginGuardPaciente]},
    {path: 'autogestion', component:AutogestionComponent,canActivate:[loginGuardPaciente]},
    {path: 'mi-perfil', component:MiPerfilComponent, canActivate:[loginGuardPaciente]},
    {path: 'admin/medico-list', component:MedicosListComponent,canActivate:[loginGuardAdmin]},
    {path: 'admin/medico-form', component:MedicoFormComponent,canActivate:[loginGuardAdmin]},
    {path: 'admin/medico-form/:id', component:MedicoFormComponent,canActivate:[loginGuardAdmin]},
    {path: 'usuario-list', component:UsuariosListComponent,canActivate:[loginGuardSecretaria]},
    {path: 'usuario-form/:id', component:UsuarioFormComponent,canActivate:[loginGuardSecretaria]},
    {path: 'login', component:LoginComponent},
    {path: 'recover-password', component:RecoverPasswordComponent},
    {path: 'secretaria', component:SecretariaPageComponent,canActivate:[loginGuardSecretaria]},
    {path: 'form-turno', component:FormTurnoComponent,canActivate:[loginGuardPaciente]},
    {path: 'form-turno/:id', component:FormTurnoComponent,canActivate:[loginGuardPaciente]},
    {path: 'registro', component:RegistroComponent},
    {path: 'registro/:id', component:RegistroComponent,canActivate:[loginGuardAdmin]},
    {path: 'secretaria/nuevo-turno', component:FormNuevoTurnoComponent,canActivate:[loginGuardSecretaria]},
    {path: 'secretaria/nuevo-turno/:id', component:FormNuevoTurnoComponent,canActivate:[loginGuardSecretaria]},
    
    {path: 'mis-turnos', component:MisTurnosComponent,canActivate:[loginGuardPaciente]},
    {path: 'cambiar-password', component:CambiarPasswordComponent},
    {path: 'baneado', component:BanPageComponent},
    { path: 'reset-password', component: NewPasswordComponent },
    { path: 'reset-password/:token', component: NewPasswordComponent },
    { path: 'terminal', component:TerminalComponent ,canActivate:[loginGuardTerminal]},
   
];

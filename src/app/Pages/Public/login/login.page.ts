import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  contrasena: string = '';

  constructor(
    public servicio: AuthService,
    public navCtrl: NavController
  ) {}

  login() {
    if (!this.email || !this.contrasena) {
        this.servicio.showToast('Complete todos los campos');
        return;
    }

    let datos = {
        accion: 'login',
        email: this.email,
        contrasena: this.contrasena
    };

    this.servicio.postData(datos).subscribe((res: any) => {
        if (res.estado) {
            // Guardar datos del usuario en sesión
            this.servicio.createSession('id_usuario', res.usuario.id_usuario);
            this.servicio.createSession('nombres_completos', res.usuario.nombres_completos);
            this.servicio.createSession('id_rol', res.usuario.id_rol);
            this.servicio.createSession('nombre_rol', res.usuario.nombre_rol);
            
            // Redirección según el rol
            switch(res.usuario.nombre_rol) {
                case 'Administrador':
                    this.navCtrl.navigateRoot(['/home-admin']);
                    break;
                case 'Asesor':
                    this.navCtrl.navigateRoot(['/home-asesor']);
                    break;
                case 'Cliente':
                    this.navCtrl.navigateRoot(['/home-cliente']);
                    break;
                default:
                    this.servicio.showToast('Rol no reconocido');
                    break;
            }
        } else {
            this.servicio.showToast(res.mensaje);
        }
    }, (error) => {
        this.servicio.showToast('Error de conexión');
    });
}

  createUser() {
    this.navCtrl.navigateForward('user-register');
  }
}
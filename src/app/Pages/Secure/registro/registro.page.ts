import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { AlertController, NavController } from '@ionic/angular';



@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  usuario = {
    nombres_completos: '',
    direccion: '',
    telefono: '',
    id_rol: '',
    email: '',
    contrasena: '',
    confirmar_contrasena: ''
  };

  roles: any[] = [];
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { 
    this.cargarRoles();
  }

  cargarRoles() {
    const datos = { accion: 'cargarRoles' };
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.roles = res.datos;
      } else {
        this.mostrarAlerta('Error', res.mensaje || 'No se pudieron cargar los roles');
      }
    });
  }

  async registrar() {
    // Validaciones
    if (this.usuario.contrasena !== this.usuario.confirmar_contrasena) {
      this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!this.validarEmail(this.usuario.email)) {
      this.mostrarAlerta('Error', 'Ingrese un email válido');
      return;
    }

    if (!this.usuario.id_rol) {
      this.mostrarAlerta('Error', 'Seleccione un rol');
      return;
    }

    const datos = {
      accion: 'registrarUsuario',
      nombres_completos: this.usuario.nombres_completos,
      direccion: this.usuario.direccion,
      telefono: this.usuario.telefono,
      id_rol: this.usuario.id_rol,
      email: this.usuario.email,
      contrasena: this.usuario.contrasena
    };

    this.authService.postData(datos).subscribe(async (res: any) => {
      if (res.estado) {
        const alert = await this.alertCtrl.create({
          header: 'Éxito',
          message: res.mensaje,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.navCtrl.navigateRoot('/login');
            }
          }]
        });
        await alert.present();
      } else {
        this.mostrarAlerta('Error', res.mensaje);
      }
    });
  }

  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
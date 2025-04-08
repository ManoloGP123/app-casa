import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-modal-usuarios',
  standalone: false,
  templateUrl: './modal-usuarios.page.html',
  styleUrls: ['./modal-usuarios.page.scss'],
})
export class ModalUsuariosPage implements OnInit {
  @Input() usuario: any;
  @Input() roles: any[] = [];
  
  nuevoUsuario: boolean = true;
  datosUsuario: any = {
    id_usuario: '',
    nombres_completos: '',
    direccion: '',
    telefono: '',
    id_rol: '',
    email: '',
    contrasena: '',
    confirmar_contrasena: ''
  };

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.usuario) {
      this.nuevoUsuario = false;
      this.datosUsuario = { ...this.usuario, contrasena: '', confirmar_contrasena: '' };
    }
  }

  guardarUsuario() {
    if (this.datosUsuario.contrasena !== this.datosUsuario.confirmar_contrasena) {
      this.authService.showToast('Las contraseñas no coinciden');
      return;
    }

    const accion = this.nuevoUsuario ? 'crearUsuario' : 'actualizarUsuario';
    
    const datos = {
      accion: accion,
      usuario: this.datosUsuario
    };

    this.authService.postData(datos).subscribe((res: any) => {
      this.authService.showToast(res.mensaje);
      if (res.estado) {
        this.modalCtrl.dismiss();
      }
    });
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
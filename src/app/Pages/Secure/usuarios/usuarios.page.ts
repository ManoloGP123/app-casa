import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../Services/auth.service';
import { ModalUsuariosPage } from './modal-usuarios/modal-usuarios.page';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];
  terminoBusqueda: string = '';
  roles: any[] = [];
  rolSeleccionado: string = '';

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios() {
    const datos = {
      accion: 'cargarUsuarios',
      busqueda: this.terminoBusqueda,
      rol: this.rolSeleccionado
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.usuarios = res.usuarios;
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  cargarRoles() {
    const datos = { accion: 'cargarRoles' };
    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.roles = res.roles;
      }
    });
  }

  async abrirModalUsuario(usuario: any = null) {
    const modal = await this.modalCtrl.create({
      component: ModalUsuariosPage,
      componentProps: { usuario, roles: this.roles }
    });

    modal.onDidDismiss().then(() => {
      this.cargarUsuarios();
    });

    await modal.present();
  }

  async eliminarUsuario(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmarEliminar(id);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmarEliminar(id: string) {
    const datos = {
      accion: 'eliminarUsuario',
      id: id
    };

    this.authService.postData(datos).subscribe((res: any) => {
      this.authService.showToast(res.mensaje);
      if (res.estado) {
        this.cargarUsuarios();
      }
    });
  }

  buscarUsuarios() {
    this.cargarUsuarios();
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.rolSeleccionado = '';
    this.cargarUsuarios();
  }
}
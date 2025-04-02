import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-buscar-usuario',
  standalone: false,
  templateUrl: './buscar-usuario.page.html',
  styleUrls: ['./buscar-usuario.page.scss'],
})
export class BuscarUsuarioPage {
  @Input() tipoUsuario: string = ''; // 'asesor' o 'cliente'
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {}

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    const rol = this.tipoUsuario === 'asesor' ? 'Asesor' : 'Cliente';
    const datos = {
      accion: 'buscarUsuariosPorRol',
      rol: rol
    };

    this.authService.postData(datos).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.usuarios = res.usuarios;
        this.usuariosFiltrados = [...this.usuarios];
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  filtrarUsuarios() {
    if (this.searchTerm.trim() === '') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.usuariosFiltrados = this.usuarios.filter(usuario => 
        usuario.nombres_completos.toLowerCase().includes(term)
      );
    }
  }

  seleccionarUsuario(usuario: any) {
    this.modalCtrl.dismiss({
      usuarioSeleccionado: usuario
    });
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
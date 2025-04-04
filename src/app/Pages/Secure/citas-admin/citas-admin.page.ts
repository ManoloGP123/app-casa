import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ModalController, AlertController } from '@ionic/angular';
import { CitasPage } from '../citas/citas.page';

@Component({
  selector: 'app-citas-admin',
  standalone: false,
  templateUrl: './citas-admin.page.html',
  styleUrls: ['./citas-admin.page.scss'],
})
export class CitasAdminPage implements OnInit {
  citas: any[] = [];
  citasFiltradas: any[] = [];
  loading = false;

  // Filtros
  filtroNombre = '';
  filtroFecha = '';
  filtroEstado = 'todos';

  estadosCita = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'Pendiente', texto: 'Pendiente' },
    { valor: 'Confirmada', texto: 'Confirmada' },
    { valor: 'Cancelada', texto: 'Cancelada' },
    { valor: 'Completada', texto: 'Completada' }
  ];

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.cargarCitas();
  }
  getColorEstado(estado: string): string {
    switch(estado) {
      case 'Pendiente':
        return 'warning';
      case 'Confirmada':
        return 'success';
      case 'Cancelada':
        return 'danger';
      case 'Completada':
        return 'primary';
      default:
        return 'medium';
    }
  }

  async cargarCitas() {
    this.loading = true;
    const datos = { accion: 'cargarCitas' };

    this.authService.postData(datos).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.citas = res.citas;
        this.aplicarFiltros();
      } else {
        this.mostrarError('Error al cargar citas', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.mostrarError('Error de conexión', 'No se pudieron cargar las citas');
    });
  }

  aplicarFiltros() {
    this.citasFiltradas = this.citas.filter(cita => {
      // Filtro por nombre (cliente o asesor)
      const nombreMatch = this.filtroNombre === '' || 
        cita.nombre_cliente.toLowerCase().includes(this.filtroNombre.toLowerCase()) || 
        cita.nombre_asesor.toLowerCase().includes(this.filtroNombre.toLowerCase());

      // Filtro por fecha
      const fechaMatch = this.filtroFecha === '' || 
        cita.fecha === this.filtroFecha;

      // Filtro por estado
      const estadoMatch = this.filtroEstado === 'todos' || 
        cita.estado === this.filtroEstado;

      return nombreMatch && fechaMatch && estadoMatch;
    });
  }

  limpiarFiltros() {
    this.filtroNombre = '';
    this.filtroFecha = '';
    this.filtroEstado = 'todos';
    this.aplicarFiltros();
  }

  async editarCita(cita: any) {
    // Guardar el ID de la cita en sesión
    await this.authService.createSession('id_cita', cita.id_cita);
    await this.authService.createSession('accion', 'editar');
    
    const modal = await this.modalCtrl.create({
      component: CitasPage,  // Usamos el mismo componente de citas
      componentProps: {
        modoEdicion: true,
        citaExistente: cita
      }
    });
  
    modal.onDidDismiss().then((data) => {
      if (data.data?.actualizado) {
        this.cargarCitas(); // Recargar la lista si se editó
      }
    });
  
    await modal.present();
  }

  async eliminarCita(idCita: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de eliminar esta cita?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.confirmarEliminar(idCita);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarEliminar(idCita: string) {
    this.loading = true;
    const datos = { accion: 'eliminarCita', id: idCita };

    this.authService.postData(datos).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.mostrarExito('Cita eliminada', 'La cita se eliminó correctamente');
        this.cargarCitas();
      } else {
        this.mostrarError('Error al eliminar', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.mostrarError('Error de conexión', 'No se pudo eliminar la cita');
    });
  }

  async mostrarError(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarExito(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  
}
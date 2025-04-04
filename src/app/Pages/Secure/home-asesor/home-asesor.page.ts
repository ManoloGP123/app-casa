import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ModalController, AlertController } from '@ionic/angular';
//import { VerCitaPage } from '../ver-cita/ver-cita.page';

@Component({
  selector: 'app-home-asesor',
  standalone: false,
  templateUrl: './home-asesor.page.html',
  styleUrls: ['./home-asesor.page.scss'],
})
export class HomeAsesorPage implements OnInit {
  segmento: string = 'pendientes';
  busqueda: string = '';
  citasPendientes: any[] = [];
  citasCompletadas: any[] = [];
  idAsesor: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.idAsesor = await this.authService.getSession('id_usuario') || "";
    this.cargarCitas();
  }

  async cargarCitas() {
    this.loading = true;
    const data = { 
      accion: 'cargarCitasAsesor', 
      id_asesor: this.idAsesor,
      busqueda: this.busqueda
    };

    this.authService.postData(data).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        // Separar citas por estado y ordenar por fecha y hora más reciente
        this.citasPendientes = res.citas
          .filter((c: any) => c.estado === 'Pendiente')
          .sort((a: any, b: any) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaA.getTime() - fechaB.getTime(); // Orden ascendente (próximas primero)
          });

        this.citasCompletadas = res.citas
          .filter((c: any) => c.estado === 'Completada')
          .sort((a: any, b: any) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaB.getTime() - fechaA.getTime(); // Orden descendente (recientes primero)
          });
      } else {
        this.mostrarAlerta('Error', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.mostrarAlerta('Error', 'No se pudieron cargar las citas');
    });
  }

  buscarCitas(event: any) {
    this.busqueda = event.target.value;
    this.cargarCitas();
  }

  segmentChanged(event: any) {
    this.segmento = event.detail.value;
  }

  async verCita(cita: any) {
    
  }

  async cambiarEstadoCita(cita: any, nuevoEstado: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Cambiar estado de la cita a ${nuevoEstado}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.actualizarEstadoCita(cita.id_cita, nuevoEstado);
          }
        }
      ]
    });

    await alert.present();
  }

  actualizarEstadoCita(idCita: string, estado: string) {
    this.loading = true;
    const data = {
      accion: 'actualizarEstadoCita',
      id_cita: idCita,
      estado: estado
    };

    this.authService.postData(data).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.cargarCitas(); // Recargar la lista
        this.authService.showToast(`Estado cambiado a ${estado}`);
      } else {
        this.mostrarAlerta('Error', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.mostrarAlerta('Error', 'No se pudo actualizar el estado');
    });
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
}
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ModalController, AlertController } from '@ionic/angular';
import { NegociacionModalPage } from './negociacion-modal/negociacion-modal.page';

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
        this.citasPendientes = res.citas
          .filter((c: any) => c.estado === 'Pendiente')
          .sort((a: any, b: any) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaA.getTime() - fechaB.getTime();
          });

        this.citasCompletadas = res.citas
          .filter((c: any) => c.estado === 'Completada')
          .sort((a: any, b: any) => {
            const fechaA = new Date(`${a.fecha} ${a.hora}`);
            const fechaB = new Date(`${b.fecha} ${b.hora}`);
            return fechaB.getTime() - fechaA.getTime();
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
    await this.authService.createSession('id_cita', cita.id_cita);
    
    const modal = await this.modalCtrl.create({
      component: NegociacionModalPage,
      componentProps: { 
        cita: cita 
      }
    });

    modal.onDidDismiss().then(() => {
      this.cargarCitas();
    });

    await modal.present();
  }

  async cambiarEstadoCita(cita: any, nuevoEstado: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: nuevoEstado === 'Cancelada' 
        ? '¿Estás seguro de cancelar esta cita?' 
        : '¿Desea iniciar la negociación?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: async () => {
            if (nuevoEstado === 'Cancelada') {
              await this.borrarCitaYNegociacion(cita.id_cita);
            } else {
              await this.iniciarNegociacion(cita);
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async borrarCitaYNegociacion(idCita: string) {
    this.loading = true;
    
    // Primero verificar si existe negociación
    const dataVerificar = {
      accion: 'buscarNegociacion2',
      id_cita: idCita
    };

    this.authService.postData(dataVerificar).subscribe(async (resVerificar: any) => {
      if (resVerificar.estado && resVerificar.negociacion) {
        // Si existe negociación, borrarla primero
        const dataBorrarNegociacion = {
          accion: 'eliminarNegociacion',
          id_negociacion: resVerificar.negociacion.id_negociacion
        };

        this.authService.postData(dataBorrarNegociacion).subscribe((resNegociacion: any) => {
          if (resNegociacion.estado) {
            // Luego borrar la cita
            this.borrarCita(idCita);
          } else {
            this.loading = false;
            this.mostrarAlerta('Error', 'No se pudo cancelar la negociación');
          }
        });
      } else {
        // Si no existe negociación, borrar directamente la cita
        this.borrarCita(idCita);
      }
    }, error => {
      this.loading = false;
      this.mostrarAlerta('Error', 'Error al verificar negociación');
    });
  }

  async borrarCita(idCita: string) {
    const data = {
      accion: 'eliminarCita',
      id: idCita
    };

    this.authService.postData(data).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.authService.showToast('Cita cancelada correctamente');
        this.cargarCitas();
      } else {
        this.mostrarAlerta('Error', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.mostrarAlerta('Error', 'No se pudo cancelar la cita');
    });
  }

  async iniciarNegociacion(cita: any) {
    await this.authService.createSession('id_cita', cita.id_cita);
    
    const modal = await this.modalCtrl.create({
      component: NegociacionModalPage,
      componentProps: { 
        cita: cita 
      }
    });

    modal.onDidDismiss().then(() => {
      this.cargarCitas();
    });

    await modal.present();
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
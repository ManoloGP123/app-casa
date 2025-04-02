import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { BuscarUsuarioPage } from './buscar-usuario/buscar-usuario.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  standalone : false,
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  casa: any = {}; // Datos de la casa
  citaData: any = {
    fecha: '',
    hora: '',
    asesor: null,
    cliente: null
  };
  loading = false;
  minDate: string;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    // Establecer fecha mínima como hoy
    this.minDate = new Date().toISOString().split('T')[0];
  }

  async ngOnInit() {
    await this.loadCasaData();
  }

  async loadCasaData() {
    this.loading = true;
    const idCasa = await this.authService.getSession('id_casa');
    
    if (idCasa) {
      const data = { accion: 'cargarCasa', id: idCasa };
      this.authService.postData(data).subscribe((res: any) => {
        this.loading = false;
        if (res.estado) {
          this.casa = res.casa;
        } else {
          this.showError('No se pudo cargar la propiedad', res.mensaje);
        }
      }, error => {
        this.loading = false;
        this.showError('Error de conexión', 'No se pudo cargar la propiedad');
      });
    } else {
      this.loading = false;
      this.showError('Error', 'No se encontró la propiedad seleccionada');
    }
  }

  async buscarAsesor() {
    const modal = await this.modalCtrl.create({
      component: BuscarUsuarioPage,
      componentProps: {
        tipoUsuario: 'asesor'
      },
      cssClass: 'modal-buscar-usuario'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data?.usuarioSeleccionado) {
        this.citaData.asesor = {
          id: data.data.usuarioSeleccionado.id_usuario,
          nombre: data.data.usuarioSeleccionado.nombres_completos,
          telefono: data.data.usuarioSeleccionado.telefono
        };
      }
    });

    await modal.present();
  }

  async buscarCliente() {
    const modal = await this.modalCtrl.create({
      component: BuscarUsuarioPage,
      componentProps: {
        tipoUsuario: 'cliente'
      },
      cssClass: 'modal-buscar-usuario'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data?.usuarioSeleccionado) {
        this.citaData.cliente = {
          id: data.data.usuarioSeleccionado.id_usuario,
          nombre: data.data.usuarioSeleccionado.nombres_completos,
          telefono: data.data.usuarioSeleccionado.telefono
        };
      }
    });

    await modal.present();
  }

  async guardarCita() {
    if (!this.validarCita()) return;

    const confirm = await this.alertCtrl.create({
      header: 'Confirmar Cita',
      message: `¿Agendar cita para ${this.citaData.fecha} a las ${this.citaData.hora}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.submitCita();
          }
        }
      ]
    });

    await confirm.present();
  }

  private submitCita() {
    this.loading = true;
    const data = {
      accion: 'guardarCita',
      id_casa: this.casa.id_casa,
      id_asesor: this.citaData.asesor.id,
      id_cliente: this.citaData.cliente.id,
      fecha: this.citaData.fecha,
      hora: this.citaData.hora,
      estado: 'Pendiente'
    };

    this.authService.postData(data).subscribe((res: any) => {
      this.loading = false;
      if (res.estado) {
        this.showSuccess('Cita agendada', 'La cita se ha registrado correctamente');
        this.resetForm();
        
      } else {
        this.showError('Error al guardar', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.showError('Error de conexión', 'No se pudo agendar la cita');
    });
  }

  private validarCita(): boolean {
    const errors = [];
    
    if (!this.citaData.fecha) errors.push('Seleccione una fecha');
    if (!this.citaData.hora) errors.push('Seleccione una hora');
    if (!this.citaData.asesor) errors.push('Seleccione un asesor');
    if (!this.citaData.cliente) errors.push('Seleccione un cliente');

    // Validar fecha futura
    if (this.citaData.fecha) {
      const fechaCita = new Date(this.citaData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaCita < hoy) {
        errors.push('La fecha debe ser futura');
      }
    }

    if (errors.length > 0) {
      this.showError('Datos incompletos', errors.join('<br>'));
      return false;
    }

    return true;
  }

  private resetForm() {
    this.citaData = {
      fecha: '',
      hora: '',
      asesor: null,
      cliente: null
    };
  }

  private async showError(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccess(title: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.navigateBack('/home-admin');
          }
        }
      ]
    });
    await alert.present();
  }
}
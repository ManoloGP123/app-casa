import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { ModalController, NavController } from '@ionic/angular';
import { BuscarUsuarioPage } from './buscar-usuario/buscar-usuario.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  standalone: false,
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  casa: any = {};
  citaData: any = {
    fecha: '',
    hora: '',
    asesor: null,
    cliente: null
  };
  loading = false;
  minDate: string;
  isEditMode = false;
  idCita: string | null = null;

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    this.minDate = new Date().toISOString().split('T')[0];
  }

  async ngOnInit() {
    this.idCita = await this.authService.getSession('id_cita');
    
    if (this.idCita) {
      this.isEditMode = true;
      await this.loadCitaData();
    } else {
      await this.loadCasaDataFromSession();
    }
  }

  async loadCitaData() {
    this.loading = true;
    const data = { accion: 'cargarCita', id: this.idCita };
    
    this.authService.postData(data).subscribe(async (res: any) => {
      if (res.estado && res.cita) {
        const cita = res.cita;
        this.citaData = {
          fecha: cita.fecha,
          hora: cita.hora,
          asesor: {
            id: cita.id_asesor,
            nombre: cita.nombre_asesor,
            telefono: cita.telefono_asesor || ''
          },
          cliente: {
            id: cita.id_cliente,
            nombre: cita.nombre_cliente,
            telefono: cita.telefono_cliente || ''
          }
        };
        
        // Cargar datos de la casa desde la cita en modo edición
        await this.loadCasaData(cita.id_casa);
      } else {
        this.showError('Error', 'No se pudo cargar la cita');
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.showError('Error de conexión', 'No se pudo cargar la cita');
    });
  }

  async loadCasaDataFromSession() {
    this.loading = true;
    const idCasa = await this.authService.getSession('id_casa');
    
    if (idCasa) {
      await this.loadCasaData(idCasa);
    } else {
      this.loading = false;
      this.showError('Error', 'No se encontró la propiedad seleccionada');
    }
  }

  async loadCasaData(idCasa: string) {
    this.loading = true;
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
      header: this.isEditMode ? 'Actualizar Cita' : 'Confirmar Cita',
      message: this.isEditMode 
        ? `¿Actualizar cita para ${this.citaData.fecha} a las ${this.citaData.hora}?`
        : `¿Agendar cita para ${this.citaData.fecha} a las ${this.citaData.hora}?`,
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
      accion: this.isEditMode ? 'editarCita' : 'guardarCita',
      id_cita: this.idCita,
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
        const successMessage = this.isEditMode 
          ? 'Cita actualizada correctamente' 
          : 'Cita agendada correctamente';
        this.showSuccess('Éxito', successMessage);
        this.resetForm();
      } else {
        this.showError('Error', res.mensaje);
      }
    }, error => {
      this.loading = false;
      this.showError('Error de conexión', 'No se pudo guardar la cita');
    });
  }

  private validarCita(): boolean {
    const errors = [];
    
    if (!this.citaData.fecha) errors.push('Seleccione una fecha');
    if (!this.citaData.hora) errors.push('Seleccione una hora');
    if (!this.citaData.asesor) errors.push('Seleccione un asesor');
    if (!this.citaData.cliente) errors.push('Seleccione un cliente');

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
    this.isEditMode = false;
    this.idCita = null;
    this.authService.closeSession('id_cita');
    this.authService.closeSession('id_casa');
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
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-negociacion-modal',
  standalone: false,
  templateUrl: './negociacion-modal.page.html',
  styleUrls: ['./negociacion-modal.page.scss'],
})
export class NegociacionModalPage implements OnInit {
  negociacion: any = {
    id_cita: '',
    tipo_pago: '',
    monto: null,
    detalles: '',
    estado: 'En proceso de pago',
    id_casa: '' // Nuevo campo para almacenar el id_casa
  };
  loading: boolean = false;
  isEditMode: boolean = false;
  estados = ['En proceso de pago', 'Completada'];

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.negociacion.id_cita = await this.authService.getSession('id_cita');
    await this.obtenerIdCasa(); // Primero obtenemos el id_casa
    await this.cargarNegociacion();
  }

  async obtenerIdCasa() {
    const data = {
      accion: 'obtenerIdCasaDeCita',
      id_cita: this.negociacion.id_cita
    };

    this.authService.postData(data).subscribe((res: any) => {
      if (res.estado) {
        this.negociacion.id_casa = res.id_casa;
      }
    });
  }

  async cargarNegociacion() {
    this.loading = true;
    const data = {
      accion: 'buscarNegociacion',
      id_cita: this.negociacion.id_cita
    };

    this.authService.postData(data).subscribe((res: any) => {
      this.loading = false;
      if (res.estado && res.negociacion) {
        this.negociacion = {...this.negociacion, ...res.negociacion};
        this.isEditMode = true;
      }
    }, error => {
      this.loading = false;
    });
  }

  async guardarNegociacion() {
    if (!this.validarFormulario()) return;

    this.loading = true;
    const accion = this.isEditMode ? 'actualizarNegociacion' : 'crearNegociacion';
    const data = {
      accion: accion,
      ...this.negociacion
    };

    this.authService.postData(data).subscribe(async (res: any) => {
      if (res.estado) {
        // Actualizar estado de la cita y casa según el estado de la negociación
        await this.actualizarEstados();
      } else {
        this.authService.showToast(res.mensaje || 'Error al guardar');
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.authService.showToast('Error de conexión');
    });
  }

  async actualizarEstados() {
    // Primero actualizar estado de la cita a "Completada"
    await this.actualizarEstadoCita();
    
    // Luego actualizar estado de la casa según el estado de la negociación
    const estadoCasa = this.negociacion.estado === 'Completada' ? 'Vendido' : 'Reservado';
    await this.actualizarEstadoCasa(estadoCasa);
  }

  async actualizarEstadoCita() {
    const data = {
      accion: 'actualizarEstadoCita',
      id_cita: this.negociacion.id_cita,
      estado: 'Completada'
    };

    this.authService.postData(data).subscribe((res: any) => {
      if (!res.estado) {
        this.authService.showToast('Error al actualizar estado de cita');
      }
    });
  }

  async actualizarEstadoCasa(estado: string) {
    const data = {
      accion: 'actualizarEstadoCasa',
      id_casa: this.negociacion.id_casa,
      estado: estado
    };

    this.authService.postData(data).subscribe((res: any) => {
      if (res.estado) {
        const message = this.negociacion.estado === 'Completada' 
          ? 'Negociación completada. Casa marcada como Vendido' 
          : 'Negociación en proceso. Casa marcada como Reservado';
        this.authService.showToast(message);
        this.modalCtrl.dismiss({ success: true });
      } else {
        this.authService.showToast('Error al actualizar estado de casa');
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.negociacion.tipo_pago) {
      this.authService.showToast('Seleccione un tipo de pago');
      return false;
    }
    if (!this.negociacion.monto || isNaN(this.negociacion.monto) || this.negociacion.monto <= 0) {
      this.authService.showToast('Ingrese un monto válido mayor a cero');
      return false;
    }
    return true;
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
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
    estado: 'En proceso de pago'
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
    await this.cargarNegociacion();
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
        this.negociacion = res.negociacion;
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
        // Si el estado es Completada, actualizar estado de la cita
        if (this.negociacion.estado === 'Completada') {
          await this.actualizarEstadoCita();
        } else {
          this.authService.showToast('Negociación guardada correctamente');
          this.modalCtrl.dismiss({ success: true });
        }
      } else {
        this.authService.showToast(res.mensaje || 'Error al guardar');
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.authService.showToast('Error de conexión');
    });
  }

  async actualizarEstadoCita() {
    const data = {
      accion: 'actualizarEstadoCita',
      id_cita: this.negociacion.id_cita,
      estado: 'Completada'
    };

    this.authService.postData(data).subscribe((res: any) => {
      if (res.estado) {
        this.authService.showToast('Negociación y cita completadas');
        this.modalCtrl.dismiss({ success: true });
      } else {
        this.authService.showToast('Negociación guardada pero error al actualizar cita');
      }
    });
  }

  validarFormulario(): boolean {
    if (!this.negociacion.tipo_pago) {
      this.authService.showToast('Seleccione un tipo de pago');
      return false;
    }
    if (!this.negociacion.monto || isNaN(this.negociacion.monto)) {
      this.authService.showToast('Ingrese un monto válido');
      return false;
    }
    return true;
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }
}
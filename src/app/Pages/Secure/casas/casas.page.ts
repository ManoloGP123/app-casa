import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../Services/auth.service';
import { CasasModalPage } from './casas-modal/casas-modal.page';

@Component({
  selector: 'app-casas',
  standalone: false,
  templateUrl: './casas.page.html',
  styleUrls: ['./casas.page.scss'],
})
export class CasasPage implements OnInit {
  casas: any[] = [];
  provinciasEcuador: string[] = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 
    'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 
    'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 
    'Manabí', 'Morona Santiago', 'Napo', 
    'Orellana', 'Pastaza', 'Pichincha', 
    'Santa Elena', 'Santo Domingo', 'Sucumbíos', 
    'Tungurahua', 'Zamora Chinchipe'
  ];
  ciudadesPorProvincia: {[key: string]: string[]} = {
    'Pichincha': ['Quito', 'Cayambe', 'Machachi', 'Sangolquí'],
    'Guayas': ['Guayaquil', 'Durán', 'Samborondón'],
    // Agrega más provincias y ciudades según necesites
  };
  
  provinciaSeleccionada: string = '';
  ciudadSeleccionada: string = '';
  filtroEstado: string = 'todos';

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cargarCasas();
  }

  cargarCasas() {
    let datos = {
      accion: 'cargarCasas',
      provincia: this.provinciaSeleccionada,
      ciudad: this.ciudadSeleccionada,
      estado: this.filtroEstado !== 'todos' ? this.filtroEstado : null
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.casas = res.casas;
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  async abrirModalCasa(casa: any = null) {
    const modal = await this.modalCtrl.create({
      component: CasasModalPage,
      componentProps: { casa }
    });

    modal.onDidDismiss().then(() => {
      this.cargarCasas();
    });

    await modal.present();
  }

  async eliminarCasa(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar esta casa?',
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
    let datos = {
      accion: 'eliminarCasa',
      id: id
    };

    this.authService.postData(datos).subscribe((res: any) => {
      this.authService.showToast(res.mensaje);
      if (res.estado) {
        this.cargarCasas();
      }
    });
  }

  aplicarFiltros() {
    this.cargarCasas();
  }

  limpiarFiltros() {
    this.provinciaSeleccionada = '';
    this.ciudadSeleccionada = '';
    this.filtroEstado = 'todos';
    this.cargarCasas();
  }
}
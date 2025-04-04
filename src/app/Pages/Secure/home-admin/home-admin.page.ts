import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CasasModalPage } from './casas-modal/casas-modal.page';

@Component({
  selector: 'app-home-admin',
  standalone : false,
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  casas: any[] = [];
  direccionBusqueda: string = '';
  isLoading: boolean = false;
  
  provinciasEcuador: string[] = [
    'Pichincha', 'Guayas', 'Azuay', 'Manabí', 'El Oro', 'Tungurahua', 'Loja', 'Imbabura', 'Cotopaxi', 'Chimborazo', 'Bolívar', 'Cañar', 'Carchi', 'Esmeraldas', 'Galápagos', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Santa Elena', 'Santo Domingo', 'Sucumbíos', 'Zamora Chinchipe'
  ];
  
  ciudadesPorProvincia: {[key: string]: string[]} = {
    'Pichincha': ['Quito', 'Cayambe', 'Machachi', 'Sangolquí', 'Tabacundo', 'Puerto Quito'],
    'Guayas': ['Guayaquil', 'Durán', 'Samborondón', 'Daule', 'Milagro', 'Nobol'],
    'Azuay': ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig'],
    // Agrega más provincias y ciudades según necesites
  };
  
  provinciaSeleccionada: string = '';
  ciudadSeleccionada: string = '';

  constructor(
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarTodasLasCasas();
    this.authService.createSession('id_cita', '');

  }

  cargarTodasLasCasas() {
    this.isLoading = true;
    let datos = {
      accion: 'cargarCasas',
      provincia: this.provinciaSeleccionada,
      ciudad: this.ciudadSeleccionada
    };

    this.authService.postData(datos).subscribe((res: any) => {
      this.isLoading = false;
      if (res.estado) {
        this.casas = res.casas;
      } else {
        this.authService.showToast(res.mensaje);
        this.casas = [];
      }
    }, error => {
      this.isLoading = false;
      this.authService.showToast('Error al cargar las casas');
      this.casas = [];
    });
  }
  
  buscarPorDireccion() {
    if (this.direccionBusqueda.trim() !== '') {
      this.isLoading = true;
      let datos = {
        accion: 'cargarCasas',
        direccion: this.direccionBusqueda
      };

      this.authService.postData(datos).subscribe((res: any) => {
        this.isLoading = false;
        if (res.estado) {
          this.casas = res.casas;
        } else {
          this.authService.showToast(res.mensaje);
          this.casas = [];
        }
      }, error => {
        this.isLoading = false;
        this.authService.showToast('Error en la búsqueda');
        this.casas = [];
      });
    } else {
      this.cargarTodasLasCasas();
    }
  }
  
  aplicarFiltros() {
    this.cargarTodasLasCasas();
  }
  
  limpiarFiltros() {
    this.provinciaSeleccionada = '';
    this.ciudadSeleccionada = '';
    this.direccionBusqueda = '';
    this.cargarTodasLasCasas();
  }
  
  async verCasa(idCasa: string) {
    console.log(idCasa)
    await this.authService.createSession('id_casa', idCasa);
    
    const modal = await this.modalCtrl.create({
      component: CasasModalPage,
    });
    
    await modal.present();
    
    modal.onDidDismiss().then(() => {
      this.cargarTodasLasCasas();
    });
  }

  onProvinciaChange() {
    this.ciudadSeleccionada = ''; // Reset ciudad cuando cambia provincia
  }
}
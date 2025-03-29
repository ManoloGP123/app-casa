import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-casas-modal',
  standalone: false,
  templateUrl: './casas-modal.page.html',
  styleUrls: ['./casas-modal.page.scss'],
})
export class CasasModalPage implements OnInit {
  @Input() casa: any; // Datos de la casa si estamos editando

  // Provincias y ciudades de Ecuador
  provinciasEcuador: string[] = [
    'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 
    'Cotopaxi', 'El Oro', 'Esmeraldas', 'Galápagos', 
    'Guayas', 'Imbabura', 'Loja', 'Los Ríos', 
    'Manabí', 'Morona Santiago', 'Napo', 
    'Orellana', 'Pastaza', 'Pichincha', 
    'Santa Elena', 'Santo Domingo', 'Sucumbíos', 
    'Tungurahua', 'Zamora Chinchipe'
  ];
  
  ciudades: string[] = [];
  estados: string[] = ['disponible', 'reservado', 'vendido'];

  // Modelo para el formulario
  nuevaCasa: any = {
    direccion: '',
    precio: null,
    dimensiones: '',
    habitaciones: '',
    banos: '',
    descripcion: '',
    estado: 'disponible',
    provincia: '',
    ciudad: '',
    imagen: ''
  };

  isEditing: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    if (this.casa) {
      this.isEditing = true;
      this.nuevaCasa = { ...this.casa };
      
      // Si hay provincia, cargar sus ciudades
      if (this.casa.provincia) {
        this.cargarCiudades(this.casa.provincia);
      }
    }
  }

  cargarCiudades(provincia: string) {
    let datos = {
      accion: 'obtenerCiudades',
      provincia: provincia
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.ciudades = res.ciudades;
      }
    });
  }

  onProvinciaChange() {
    if (this.nuevaCasa.provincia) {
      this.cargarCiudades(this.nuevaCasa.provincia);
      this.nuevaCasa.ciudad = ''; // Resetear ciudad al cambiar provincia
    }
  }

  validarNumero(event: any, campo: string): void {
    let valor = event.target.value;
    if (valor < 1) {
      this.nuevaCasa[campo] = 1;
    }
    if (campo === 'habitaciones' && valor > 20) {
      this.nuevaCasa[campo] = 20;
    }
    if (campo === 'banos' && valor > 10) {
      this.nuevaCasa[campo] = 10;
    }
  }

  async guardarCasa() {
    if (!this.validarFormulario()) return;

    // Asegurar que habitaciones y baños sean números
    this.nuevaCasa.habitaciones = Number(this.nuevaCasa.habitaciones);
    this.nuevaCasa.banos = Number(this.nuevaCasa.banos);

    const accion = this.isEditing ? 'editarCasa' : 'guardarCasa';
    const datos = {
      accion: accion,
      id: this.isEditing ? this.nuevaCasa.id_casa : null,
      datos: this.nuevaCasa
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.authService.showToast(`Casa ${this.isEditing ? 'actualizada' : 'guardada'} correctamente`);
        this.modalCtrl.dismiss({ success: true });
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }

  validarFormulario(): boolean {
    const camposRequeridos = [
      { campo: 'direccion', nombre: 'Dirección' },
      { campo: 'precio', nombre: 'Precio' },
      { campo: 'provincia', nombre: 'Provincia' },
      { campo: 'ciudad', nombre: 'Ciudad' }
    ];

    for (let req of camposRequeridos) {
      if (!this.nuevaCasa[req.campo]) {
        this.authService.showToast(`El campo ${req.nombre} es obligatorio`);
        return false;
      }
    }

    if (this.nuevaCasa.precio <= 0) {
      this.authService.showToast('El precio debe ser mayor a 0');
      return false;
    }

    return true;
  }

  cancelar() {
    this.modalCtrl.dismiss();
  }

  async confirmarEliminar() {
    if (!this.isEditing) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de eliminar esta propiedad?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarCasa();
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarCasa() {
    const datos = {
      accion: 'eliminarCasa',
      id: this.nuevaCasa.id_casa
    };

    this.authService.postData(datos).subscribe((res: any) => {
      if (res.estado) {
        this.authService.showToast('Casa eliminada correctamente');
        this.modalCtrl.dismiss({ deleted: true });
      } else {
        this.authService.showToast(res.mensaje);
      }
    });
  }
}
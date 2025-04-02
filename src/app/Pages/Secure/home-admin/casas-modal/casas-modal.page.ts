import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../../Services/auth.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-casas-modal',
  standalone : false,
  templateUrl: './casas-modal.page.html',
  styleUrls: ['./casas-modal.page.scss'],
})
export class CasasModalPage implements OnInit {
  casa: any = {};
  isLoading: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private navCtrl: NavController 
  ) { }

  async ngOnInit() {
    await this.cargarCasa();
  }

  async cargarCasa() {
    this.isLoading = true;
    const idCasa = await this.authService.getSession('id_casa');
    console.log(idCasa);
    
    if (idCasa) {
      let datos = {
        accion: 'cargarCasa',
        id: idCasa
      };

      this.authService.postData(datos).subscribe((res: any) => {
        this.isLoading = false;
        if (res.estado) {
          this.casa = res.casa;
        } else {
          this.authService.showToast(res.mensaje);
          this.cerrarModal();
        }
      }, error => {
        this.isLoading = false;
        this.authService.showToast('Error al cargar la casa');
        this.cerrarModal();
      });
    } else {
      this.isLoading = false;
      this.authService.showToast('No se encontró el ID de la casa');
      this.cerrarModal();
    }
  }

  async agendarCita() {
    const alert = await this.alertController.create({
      header: 'Agendar Cita',
      message: '¿Desea agendar una cita para visitar esta propiedad?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.confirmarCita();
          }
        }
      ]
    });

    await alert.present();
  }

  async confirmarCita() {
    // Cierra el modal primero
    await this.modalCtrl.dismiss();
    
    // Navega a la página de citas
    this.navCtrl.navigateRoot('/citas');
    
    
  }


  cerrarModal() {
    this.modalCtrl.dismiss();
  }
}
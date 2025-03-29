import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//toast
import { ToastController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  serve: string = 'http://localhost/app-casa/ws-app-casa/ws-app-casa.php';

  constructor(public http: HttpClient, public toastCtrl: ToastController) {}
  postData(body: any) {
    let head = new HttpHeaders({
      'Content-Type': 'application/json, charset:utf8',
    });
    let options = {
      headers: head,
    };
    return this.http.post(this.serve, JSON.stringify(body), options);
  }
  async showToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  async createSession(id: string, valor: string) {
    await Preferences.set({
      key: id,
      value: valor
    });
  }
  
  async getSession(id: string) {
    const item = await Preferences.get({ key: id });
    return item.value;
  }
  async closeSession(id: string) {
    await Preferences.clear();
  }

  async saveToken(token: string) {
    await Preferences.set({
      key: 'recovery_token',
      value: token,
    });
  }
  
  async getToken() {
    const { value } = await Preferences.get({ key: 'recovery_token' });
    return value;
  }
  async saveUserCode(userCode: string) {
    await Preferences.set({
      key: 'usad_code',
      value: userCode,
    });
  }
  
  async getUserCode() {
    const { value } = await Preferences.get({ key: 'usad_code' });
    return value;
  }
  



  }
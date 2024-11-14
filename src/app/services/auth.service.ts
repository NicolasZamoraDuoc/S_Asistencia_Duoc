import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { showAlertError, showToast } from 'src/app/tools/message-functions';
import { Storage } from '@ionic/storage-angular';
import { DataBaseService } from './data-base.service';
import { Usuario } from '../model/usuario';
import { Asistencia } from '../model/asistencia'; // Asegúrate de usar la ruta correcta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  private qrDataSubject = new BehaviorSubject<Asistencia | null>(null);
  public qrCodeData = this.qrDataSubject.asObservable();

  setQRData(data: string | Asistencia) {
    try {
      let asistencia: Asistencia;
      if (typeof data === 'string') {
        asistencia = Asistencia.fromJson(data); // Ahora podemos usar el método estático
      } else {
        asistencia = data;
      }
      this.qrDataSubject.next(asistencia);
    } catch (error) {
      console.error('Error processing QR data:', error);
      this.qrDataSubject.next(null);
    }
  }

  getCurrentQRData(): Asistencia | null {
    return this.qrDataSubject.value;
  }
  storageAuthUserKey = 'AUTHENTICATED_USER';
  isFirstLogin = new BehaviorSubject<boolean>(false);
  storageQrCodeKey = 'QR_CODE';
  keyUsuario = 'USUARIO_AUTENTICADO';
  usuarioAutenticado = new BehaviorSubject<Usuario | null>(null);

  primerInicioSesion =  new BehaviorSubject<boolean>(false);
  selectedButton = new BehaviorSubject<string>('codigoqr');

  private contraseñaSubject = new BehaviorSubject<string>('');
  contraseña$ = this.contraseñaSubject.asObservable() //pregunta

  constructor(private router: Router, private bd: DataBaseService, private storage: Storage) { }

  async initializeAuthService() {
    try {
      await this.storage.create();
    } catch (error) {
      showAlertError('AuthService.initializeAuthService', error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return await this.leerUsuarioAutenticado().then(usuario => {
      return usuario !== null;
    });
  }

  async leerUsuarioAutenticado(): Promise<Usuario | null> {
    const usuario = await this.storage.get(this.keyUsuario) as Usuario;
    this.usuarioAutenticado.next(usuario);
    return usuario;
  }


  guardarUsuarioAutenticado(usuario: Usuario) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

  eliminarUsuarioAutenticado(usuario: Usuario) {
    this.storage.remove(this.keyUsuario);
    this.usuarioAutenticado.next(null);
  }


  async login(cuenta: string, password: string) {
    await this.storage.get(this.keyUsuario).then(async (usuarioAutenticado) => {
      if (usuarioAutenticado) {
        this.usuarioAutenticado.next(usuarioAutenticado);
        this.primerInicioSesion.next(false); // Avisar que no es el primer inicio de sesión
        this.router.navigate(['/home']);
      } else {
        await this.bd.buscarUsuarioValido(cuenta, password).then(async (usuario: Usuario | undefined) => {
          if (usuario) {
            showToast(`¡Bienvenido(a) ${usuario.nombre} ${usuario.apellido}!`);
            this.guardarUsuarioAutenticado(usuario);
            this.primerInicioSesion.next(true); // Avisar que es el primer inicio de sesión
            this.router.navigate(['/incio']);
          } else { 
            showToast(`El correo o la password son incorrectos`);
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }


  async logout() {
    this.leerUsuarioAutenticado().then((usuario) => {
      if (usuario) {
        showToast(`¡Hasta pronto ${usuario.nombre} ${usuario.apellido}!`);
        this.eliminarUsuarioAutenticado(usuario);
      }
      this.router.navigate(['/login']);
    })
  }


 
  setUsuarioAutenticado(usuario: Usuario) {
    this.storage.set(this.keyUsuario, usuario);
    this.usuarioAutenticado.next(usuario);
  }

}

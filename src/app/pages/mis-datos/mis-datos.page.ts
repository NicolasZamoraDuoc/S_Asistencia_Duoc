import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/model/usuario';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from 'src/app/model/post';
import { APIClientService } from 'src/app/services/apiclient.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { showToast } from 'src/app/tools/message-functions';
import { TranslateModule } from '@ngx-translate/core';
import { AlertController, IonicSafeString, AnimationController, ToastController} from '@ionic/angular';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.page.html',
  styleUrls: ['./mis-datos.page.scss'],
  standalone: true,
  imports: [IonButton, IonInput, IonContent, IonHeader, IonTitle, IonToolbar
    , CommonModule, FormsModule, IonItem, IonSelect, IonSelectOption, TranslateModule ]
})
export class MisDatosPage implements OnInit {

  public usuario: Usuario = new Usuario();
  public nivelesEducacionales: NivelEducacional[] = []; // Lista de niveles educacionales
  public fechaNacimientoInput: string = ''; // Fecha en formato para ion-datetime

  constructor(
    private db: DataBaseService,
    private auth: AuthService,
    private api: APIClientService,
    private alertController: AlertController,
    private animationController: AnimationController) 
  { 
  
    this.auth.usuarioAutenticado.subscribe((usuario) => {
      console.log(usuario);
      if (usuario) {
        this.usuario = usuario;
      }
    });
  
  }

  ngOnInit() {
    this.nivelesEducacionales = NivelEducacional.getNivelesEducacionales();

    // Convertir fechaNacimiento a formato 'yyyy-MM-dd' si tiene un valor inicial
    if (this.usuario.fechaNacimiento) {
      this.fechaNacimientoInput = this.formatDateForInput(this.usuario.fechaNacimiento);
    }
  }

  private formatDateForInput(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // formato "YYYY-MM-DD" requerido por ion-datetime
  }

  // Actualizar fechaNacimiento cuando se seleccione una nueva fecha en ion-datetime
  onFechaNacimientoChange(event: any) {
    const selectedDate = event.detail.value; // Fecha seleccionada en formato "YYYY-MM-DD"
    const [year, month, day] = selectedDate.split('-').map(Number);
    this.usuario.fechaNacimiento = new Date(year, month - 1, day); // Convertir a Date
  }

  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }

  

  mostrarDatosPersona() {
    // Si el usuario no ingresa la cuenta, se mostrará un error
    if (this.usuario.correo.trim() === '') {
      this.mostrarMensajeAlerta('El correo es un campo obligatorio.');
      return;
    }

    // Si el usuario no ingresa al menos el nombre o el apellido, se mostrará un error
 

    // Mostrar un mensaje emergente con los datos de la persona
    let mensaje = `

  
  Cuenta:   ${this.usuario.cuenta}
  Nombre:   ${this.asignado(this.usuario.nombre)}
  Apellido:   ${this.asignado(this.usuario.apellido)}
  Correo:   ${this.asignado(this.usuario.correo)} 
  Pregunta Secreta:   ${this.usuario.preguntaSecreta}
  Respuesta Secreta:${this.usuario.respuestaSecreta}  

  Contraseña Nueva:   ${this.usuario.password}
  Contraseña Nueva:   ${this.usuario.password}

 
    `;
    this.mostrarMensajeAlerta(mensaje);
  }



  async mostrarMensajeAlerta(mensaje: string,) {
    const alert = await this.alertController.create({
      header: 'Datos personales',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  // Función para limpiar los datos
  limpiar() {
    this.usuario.cuenta='';
    this.usuario.nombre='';
    this.usuario.apellido='';
    this.usuario.correo='';
    this.usuario.preguntaSecreta='';
    this.usuario.respuestaSecreta='';
    this.usuario.password='';


  }




  async actualizarDatos() {
    try {
      // Update the user in the database using guardarUsuario method from DataBaseService
      await this.db.guardarUsuario(this.usuario);
  
      // Show success message
      await this.mostrarMensajeExito();
    } catch (error) {
      console.error('Error updating user data:', error);
      // Show an error message
      await this.mostrarMensajeError('Hubo un problema al actualizar tus datos. Por favor, intenta nuevamente.');
    }
  }
  
  async mostrarMensajeError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  



  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Tus datos han sido actualizados correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}

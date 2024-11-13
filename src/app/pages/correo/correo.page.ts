import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';  
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { colorWandOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AuthService } from 'src/app/services/auth.service';
import { DataBaseService } from 'src/app/services/data-base.service';



@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
  standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
  , FormsModule             // CGV-Permite usar formularios
  , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  , TranslateModule         // CGV-Permite usar pipe 'translate'
  , LanguageComponent // CGV-Lista de idiomas
]
})
export class CorreoPage implements OnInit, AfterViewInit {

  usuario: Usuario = new Usuario();


  @ViewChild('page', { read: ElementRef }) page!: ElementRef;


  // Variable que almacenará el correo ingresado
  correoIngresado: string = '';
  // Usuario actual que se utilizará en la siguiente página
  usuarioActual: Usuario | null = null;

  constructor(private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController,
    private dbService: DataBaseService,
    private auth: AuthService // Inyectamos el servicio de base de datos,
  ) {

    this.auth.usuarioAutenticado.subscribe((usuario) => {
      console.log(usuario);
      if (usuario) {
        this.usuario = usuario;
      }
    });
    
   }

  ngOnInit() {
    this.dbService.inicializarBaseDeDatos();
  }

  // Función para validar si el correo ingresado pertenece a un usuario
  async validarCorreo() {
    const usuarioEncontrado = await this.dbService.buscarUsuarioPorCorreo(this.correoIngresado);
    
    if (usuarioEncontrado) {
      // Redirige a la página de pregunta secreta con el usuario encontrado
      this.router.navigate(['/pregunta'], { state: { usuario: usuarioEncontrado } });
    } else {
      // Muestra una alerta si el correo no está registrado
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El correo ingresado no está registrado.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
  
  
  

  public ngAfterViewInit() {
    // this.animarDeslizarVertical()
  }

  // animarDeslizarVertical() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(800)
  //     .fromTo('transform', 'translateY(-100%)', 'translateY(0%)')
  //     .play();
  // }
}

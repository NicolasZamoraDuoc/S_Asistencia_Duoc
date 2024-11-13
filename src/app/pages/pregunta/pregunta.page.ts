import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';  // Asegúrate de que esta importación es correcta
import { AlertController, AnimationController, NavController } from '@ionic/angular';
import { DataBaseService } from 'src/app/services/data-base.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
  standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
  , FormsModule             // CGV-Permite usar formularios
  , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  , TranslateModule         // CGV-Permite usar pipe 'translate'
  , LanguageComponent // CGV-Lista de idiomas
]
})
export class PreguntaPage implements OnInit, AfterViewInit {

  public usuario: Usuario = new Usuario();


  @ViewChild('page', { read: ElementRef }) page!: ElementRef;

  // Usuario actual que viene desde la página anterior
  usuarioActual: Usuario | null = null;
  // Respuesta ingresada por el usuario
  respuestaIngresada: string = '';

  constructor(private router: Router,
     private navCtrl: NavController,
    private animationController: AnimationController,
    private alertController: AlertController,
    private auth :AuthService,
    private db: DataBaseService
  
  ) {
    const nav = this.router.getCurrentNavigation();
    this.usuario = nav?.extras.state?.['usuario'];
      
      
     }

  ngOnInit() {
  this.usuarioActual = this.usuario;
  }

  // Función para validar la respuesta secreta
  
  async validarRespuesta() {
    const esValida = await this.db.validarPreguntaSecreta(this.usuario.cuenta, this.respuestaIngresada);

    if (esValida) {
      // Redirige a la página de éxito para mostrar la contraseña
      this.router.navigate(['/correcto'], { state: { usuario: this.usuario } });
    } else {

      this.router.navigate(['/incorrecto'])

    }
  }
  

    ngAfterViewInit() {
      // this.animarDeslizarVertical()
  }

  // animarDeslizarVertical() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(800)
  //     .fromTo('transform', 'translateY(100%)', 'translateY(0%)')
  //     .play();
  // }
    
  }



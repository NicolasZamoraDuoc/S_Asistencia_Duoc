import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
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

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
    standalone: true,
  imports: [
    CommonModule            // CGV-Permite usar directivas comunes de Angular
  , FormsModule             // CGV-Permite usar formularios
  , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
  , TranslateModule         // CGV-Permite usar pipe 'translate'
  , LanguageComponent // CGV-Lista de idiomas
]
})
export class CorrectoPage implements OnInit, AfterViewInit {
  usuario: Usuario;

  

  @ViewChild('page', { read: ElementRef }) page!: ElementRef;


  usuarioActual: Usuario | null = null;

  constructor(private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
    
  ) {
        // Obtener el usuario desde el estado de la navegación
        const nav = this.router.getCurrentNavigation();
        this.usuario = nav?.extras.state?.['usuario'];
      
   }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuarioActual = navigation.extras.state['usuario'];
      console.log('Usuario recibido:', this.usuarioActual); // Verifica que este log muestre el usuario
    } else {
      console.error('No se recibió el estado del usuario');
    }
  }

  ngAfterViewInit() {
    // this.animarExpansion();
    
  }

  // animarExpansion() {
  //   this.animationController
  //     .create()
  //     .addElement(this.page.nativeElement)
  //     .duration(1200)
  //     .fromTo('transform', 'scaleX(0)', 'scaleX(1)')
  //     .play();
  // }

}
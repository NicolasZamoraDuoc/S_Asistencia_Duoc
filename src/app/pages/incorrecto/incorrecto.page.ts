import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AnimationController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageComponent } from 'src/app/components/language/language.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],

  standalone: true,
  imports: [
      CommonModule            // CGV-Permite usar directivas comunes de Angular
    , FormsModule             // CGV-Permite usar formularios
    , IonicModule             // CGV-Permite usar componentes de Ionic como IonContent, IonItem, etc.
    , TranslateModule         // CGV-Permite usar pipe 'translate'
    , LanguageComponent // CGV-Lista de idiomas
  ]
})
export class IncorrectoPage implements OnInit, AfterViewInit {

  @ViewChild('page', { read: ElementRef }) page!: ElementRef;


  constructor(
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) { 

  }

  ngOnInit() {
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

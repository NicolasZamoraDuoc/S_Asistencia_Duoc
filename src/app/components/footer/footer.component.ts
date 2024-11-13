import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pawOutline, pencilOutline, qrCodeOutline, flowerOutline, schoolOutline, gridOutline } from 'ionicons/icons';
import { MiclaseComponent } from '../miclase/miclase.component';
import { QrWebScannerComponent } from '../qr-web-scanner/qr-web-scanner.component';
import { ForumComponent } from '../forum/forum.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonButton, 
      CommonModule    // CGV-Permite usar directivas comunes de Angular
    , FormsModule     // CGV-Permite usar formularios
    , TranslateModule // CGV-Permite usar pipe 'translate'
    , IonFooter, IonToolbar, IonSegment, IonSegmentButton, IonIcon,
    ForumComponent, MiclaseComponent, QrWebScannerComponent
  ]
})
export class FooterComponent {

  selectedButton = 'welcome';
  @Output() footerClick = new EventEmitter<string>();

  constructor() { 
    addIcons({homeOutline,schoolOutline,gridOutline,pencilOutline,flowerOutline,pawOutline,qrCodeOutline});
  }

  sendClickEvent($event: any) {
    this.footerClick.emit(this.selectedButton);
  }

}

import { Component, ViewChild } from '@angular/core';
import { DinosaurComponent } from 'src/app/components/dinosaur/dinosaur.component';
import { AuthService } from 'src/app/services/auth.service';
import { IonContent } from '@ionic/angular/standalone'
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { QrWebScannerComponent } from 'src/app/components/qr-web-scanner/qr-web-scanner.component';
import { Dinosaur } from 'src/app/model/dinosaur';
import { Capacitor } from '@capacitor/core';
import { ScannerService } from 'src/app/services/scanner.service';
import { WelcomeComponent } from 'src/app/components/welcome/welcome.component';
import { ForumComponent } from 'src/app/components/forum/forum.component';
import { MapPage } from "src/app/pages/map/map.page";
import { MisDatosPage } from "../mis-datos/mis-datos.page";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, TranslateModule, IonContent,
    HeaderComponent, FooterComponent,
    WelcomeComponent, QrWebScannerComponent, DinosaurComponent,
    ForumComponent,
    MapPage,
    MisDatosPage
  ]
})
export class HomePage {
  @ViewChild(FooterComponent) footer!: FooterComponent;
  selectedComponent = 'welcome';

  constructor(private auth: AuthService, private scanner: ScannerService) { }

  ionViewWillEnter() {
    this.changeComponent('welcome');
  }

  async headerClick(button: string) {
    if (button === 'testqr') {
      this.showDinoComponent(Dinosaur.jsonDinoExample);
    }

    if (button === 'scan') {
      if (Capacitor.getPlatform() === 'web') {
        this.selectedComponent = 'qrwebscanner';
      } else {
        const scanResult = await this.scanner.scan();
        if (scanResult) {
          this.showDinoComponent(scanResult);
        }
      }
    }
  }

  // Updated to handle QR scan result properly
  webQrScanned(event: any) {
    // Intenta acceder a `event.detail` o donde se almacene el texto escaneado
    const text = event?.text || event?.detail?.text || ''; 
    if (text) {
      this.showDinoComponent(text);
    }
  }

  webQrStopped() {
    this.changeComponent('welcome');
  }

  showDinoComponent(qr: string) {
    if (Dinosaur.isValidDinosaurQrCode(qr)) {
      this.auth.setQRData(qr);
      this.changeComponent('dinosaur');
    } else {
      this.changeComponent('welcome');
    }
  }

  footerClick(button: string) {
    this.selectedComponent = button;
  }

  changeComponent(name: string) {
    this.selectedComponent = name;
    this.footer.selectedButton = name;
  }
}
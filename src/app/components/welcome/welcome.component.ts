import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { mostrarEjemplosDeMensajes } from './../../tools/message-functions';
import { CommonModule } from '@angular/common';
import { ElementRef, Output, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [TranslateModule,IonicModule, CommonModule, FormsModule]
})
export class WelcomeComponent implements OnInit {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  @Output() scanned: EventEmitter<string> = new EventEmitter<string>();
  @Output() stopped: EventEmitter<void> = new EventEmitter<void>();
  qrData: string = '';
  mediaStream: MediaStream | null = null; // Almacena el flujo de medios
  user: User = new User();

  constructor(private auth: AuthService, private authService: AuthService) { 
    this.startQrScanningForWeb();
    this.auth.authUser.subscribe((user) => {
      console.log(user);
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {}
  async startQrScanningForWeb() {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = this.mediaStream;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    requestAnimationFrame(this.verifyVideo.bind(this));
  }

  async verifyVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.getQrData()) return;
      requestAnimationFrame(this.verifyVideo.bind(this));
    } else {
      requestAnimationFrame(this.verifyVideo.bind(this));
    }
  }

  getQrData(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode  | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      const data = qrCode.data;
      if (data !== '') {
        this.stopCamera();
        this.scanned.emit(qrCode.data);
        return true;
      }
    }
    return false;
  }

  stopQrScanning(): void {
    this.stopCamera();
    this.stopped.emit();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  public mostrarDatosQROrdenados(datosQR: string): void{
    this.mostrarDatosQROrdenados;
    this.user.asistencia = JSON.parse(datosQR);
    this.authService.saveAuthUser(this.user)

  }


  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detén todas las pistas de video
      this.mediaStream = null; // Limpia el flujo de medios
    }
  }

}

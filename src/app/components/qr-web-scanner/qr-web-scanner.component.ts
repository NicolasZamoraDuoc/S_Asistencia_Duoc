import { Component, ElementRef, Output, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Asistencia } from 'src/app/model/asistencia';
import jsQR from 'jsqr';
import { Usuario } from 'src/app/model/usuario';


@Component({
  selector: 'app-qrwebscanner',
  templateUrl: './qr-web-scanner.component.html',
  styleUrls: ['./qr-web-scanner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
})
export class QrWebScannerComponent implements OnInit, OnDestroy {
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  usuario: Usuario = new Usuario();

  public escaneando = false;
  private stream: MediaStream | null = null;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    await this.startScanner();
  }

  ngOnDestroy() {
    this.stopQrScanning();
  }

  async startScanner() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = this.stream;
        this.video.nativeElement.play();
        this.escaneando = true;
        this.scanQR();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }

  private scanQR() {
    if (!this.escaneando) return;

    if (this.obtenerDatosQR()) {
      return;
    }

    requestAnimationFrame(() => this.scanQR());
  }

  private obtenerDatosQR(): boolean {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    
    if (!(video?.readyState === video.HAVE_ENOUGH_DATA)) {
      return false;
    }

    const { videoWidth: width, videoHeight: height } = video;
    canvas.width = width;
    canvas.height = height;
    
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, width, height);
    
    const imageData = context?.getImageData(0, 0, width, height);
    if (!imageData) return false;

    const code = jsQR(imageData.data, width, height, {
      inversionAttempts: 'dontInvert'
    });

    if (code) {
      try {
        const asistencia = Asistencia.fromJson(code.data);
        this.auth.setQRData(asistencia);
        this.router.navigate(['/dinosaur']);
        this.stopQrScanning();
        return true;
      } catch (error) {
        console.error('Invalid QR data:', error);
      }
    }
    return false;
  }

  public stopQrScanning(): void {
    this.escaneando = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video?.nativeElement) {
      this.video.nativeElement.srcObject = null;
    }
  }
}
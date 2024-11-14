import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Asistencia } from 'src/app/model/asistencia';

@Component({
  selector: 'app-dinosaur',
  templateUrl: './dinosaur.component.html',
  styleUrls: ['./dinosaur.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DinosaurComponent implements OnInit, OnDestroy {
  asistencia: Asistencia | null = null;
  private subscription: Subscription;

  constructor(private authService: AuthService) {
    this.subscription = this.authService.qrCodeData.subscribe((data: any) => {
      this.asistencia = data;
    });
  }

  ngOnInit() {
    // Check if we have data in the service
    const currentData = this.authService.getCurrentQRData();
    if (currentData) {
      this.asistencia = currentData;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
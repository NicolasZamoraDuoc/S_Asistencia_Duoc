import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-miclase',
  templateUrl: './miclase.component.html',
  styleUrls: ['./miclase.component.scss'],
  standalone: true,
  imports: [IonContent, IonGrid, IonRow, IonCol, CommonModule, FormsModule]
})
export class MiclaseComponent  implements OnDestroy {
  
  user: any;
  private subscription: Subscription;

  constructor(private authService: AuthService) { 
    this.subscription = this.authService.qrCodeData.subscribe((qr) => {
      this.user = qr? JSON.parse(qr): null;
    })
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

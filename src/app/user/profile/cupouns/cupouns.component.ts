import { Component, OnInit } from '@angular/core';
import { CouponsApiService } from './api/coupons-api.service';
import { PrizeResponse, Prizes } from 'src/app/prizes/models/prizes';

@Component({
  selector: 'app-cupouns',
  templateUrl: './cupouns.component.html',
  styleUrls: ['./cupouns.component.css'],
})
export class CupounsComponent implements OnInit {
  public redeemedPrizes: PrizeResponse[];
  public dataGet: boolean = false;
  public qrCode: string;
  public loader:boolean = false;

  constructor(private apiRedeemedPrizes: CouponsApiService) {}

  ngOnInit(): void {
    this.apiRedeemedPrizes.getRedeemedPrizes().subscribe({
      next: (data: PrizeResponse[]) => {
        this.redeemedPrizes = data;
        console.log(this.redeemedPrizes);
      },
      error: (e) => {},
    });
  }

  getQrCode(prize: number): void {
    this.loader = true;
    this.apiRedeemedPrizes.getQrCode(prize).subscribe({
      next: (data) => {
        this.qrCode = data[0].qr_code;
      },
      error: (e) => {
        console.log(e);

      },
      complete: () => {
        this.loader = false;
      }
    });
  }

  cleanData(): void {
    this.qrCode = '';
    this.loader = false;
  }
}

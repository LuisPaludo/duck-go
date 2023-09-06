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
  public createdPrizes: Prizes[];
  public dataGet: boolean = false;
  public qrCode: string;
  public loader: boolean = false;
  private prize: number;

  private isPartner: boolean = false;

  private index:number;

  constructor(private apiRedeemedPrizes: CouponsApiService) {}

  ngOnInit(): void {
    this.isPartner = localStorage.getItem('isPartner') === 'true';

    if (this.isPartner) {
      this.apiRedeemedPrizes.getCreatedPrizes().subscribe({
        next: (data: Prizes[]) => {
          this.createdPrizes = data;
        },
        error: (e) => {},
      });
    } else {
      this.apiRedeemedPrizes.getRedeemedPrizes().subscribe({
        next: (data: PrizeResponse[]) => {
          this.redeemedPrizes = data;
          console.log(this.redeemedPrizes);
        },
        error: (e) => {},
      });
    }
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
      },
    });
  }

  cleanData(): void {
    this.qrCode = '';
    this.loader = false;
    this.prize = null;
    this.index = null;
  }

  desactivate(): void {
    this.apiRedeemedPrizes.disablePrize(this.prize).subscribe({
      next: (data) => {
        this.createdPrizes[this.index] = data;
      },
      error: (e) => console.log(e),
    });
  }

  activate(): void {
    this.apiRedeemedPrizes.activatePrize(this.prize).subscribe({
      next: (data) => {
        this.createdPrizes[this.index] = data;
      },
      error: (e) => console.log(e),
    });
  }

  getPrize(prize: number, index:number): void {
    this.prize = prize;
    this.index = index;
  }
}

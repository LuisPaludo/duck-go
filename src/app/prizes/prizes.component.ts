import { Component, OnInit } from '@angular/core';
import { PrizesService } from './api/prizes.service';
import { Prizes } from './models/prizes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.css'],
})
export class PrizesComponent implements OnInit {
  public prizes: Prizes[];
  public loader: boolean = false;

  public prizeId: number;
  public prizeName: string;
  public prizeCost: number;
  public success: boolean = false;
  public e402: boolean = false;
  public e400: boolean = false;
  public end: boolean = false;

  constructor(private apiPrizes: PrizesService) {}

  ngOnInit(): void {
    this.apiPrizes.getPrizes().subscribe({
      next: (data) => {
        if (data) {
          this.prizes = data;
          this.apiPrizes.isGetting = false;
        }
      },
      error: () => {
        this.apiPrizes.isGetting = false;
      },
    });
  }

  redeem(id: number): void {
    this.loader = true;
    this.end = true;
    this.apiPrizes.redeemPrize(id).subscribe({
      next: (data) => {
        this.loader = false;
        this.apiPrizes.isPosting = false;
        this.success = true;
      },
      error: (e) => {
        this.loader = false;
        this.apiPrizes.isPosting = false;
        if (e instanceof HttpErrorResponse && e.status === 400) {
          this.e400 = true;
          console.log('Cupom já cadastrado');
        }
        if (e instanceof HttpErrorResponse && e.status === 402) {
          this.e402 = true;
          console.log('Usuário não possui pontos suficientes');
        }
      },
    });
  }

  confirmation(name: string, cost: number, id: number): void {
    this.loader = true;
    this.prizeName = name;
    this.prizeCost = cost;
    this.prizeId = id;
    this.loader = false;
  }

  clearData():void {
    this.prizeName = '';
    this.prizeCost = null;
    this.prizeId = null;
    this.e400 = false;
    this.e402 = false;
    this.success = false;
    this.end = false;
  }
}

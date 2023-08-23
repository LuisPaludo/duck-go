import { Component, OnInit } from '@angular/core';
import { PrizesService } from './api/prizes.service';
import { Prizes } from './models/prizes';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.css']
})
export class PrizesComponent implements OnInit {

  public prizes:Prizes[];


  constructor(private apiPrizes: PrizesService) {}

  ngOnInit(): void {
    this.apiPrizes.getPrizes().subscribe({
      next: (data)=> {
        if(data) {
          this.prizes = data;
          this.apiPrizes.isGetting = false;
        }
      },
      error: () => {
        this.apiPrizes.isGetting = false;
      }
    })
  }

  redeem(id:number):void {
    this.apiPrizes.redeemPrize(id);
  }
}

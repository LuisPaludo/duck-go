import { Component, OnInit } from '@angular/core';
import { HistoryService } from './api/history.service';
import { UserHistory } from 'src/app/home/models/history';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{

  public history:UserHistory[];

  constructor(private apiHistory: HistoryService) {}

  ngOnInit(): void {
    this.apiHistory.getUserHistory().subscribe({
      next: (data:UserHistory[]) => {
        this.history = data.slice(0).reverse()  ;
      }
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerifyApiService } from './api/verify-api.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  isLoading:boolean = true;
  hasError:boolean = false;

  constructor(private activeRout:ActivatedRoute, private verifyApi:VerifyApiService) {}

  ngOnInit(): void {
    const key = this.activeRout.snapshot.params['key'];

    this.verifyApi.verify(key).subscribe({
      next: (data) => {
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        this.hasError = true;
      }
    })
  }
}

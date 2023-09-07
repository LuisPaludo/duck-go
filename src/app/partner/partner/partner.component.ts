import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from './api/partner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Partner } from './models/partner';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.css']
})
export class PartnerComponent implements OnInit {

  private slug:string;

  public partner:Partner;

  public baseUrl:string;

  constructor(private route:ActivatedRoute,private router: Router, private apiPartner: PartnerService) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.baseUrl = this.apiPartner.urls.baseUrl;
    this.apiPartner.getPartner(this.slug).subscribe({
      next: (data:Partner) => this.partner = data,
      error: (e) => {
        if(e instanceof HttpErrorResponse && e.status === 404) {
          this.router.navigate(['not-found']);
        }
      }
    })

  }
}

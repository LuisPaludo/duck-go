import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationApiService } from './api/location-api.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css'],
})
export class LocationsComponent implements OnInit {
  locations: any;
  location:any;
  showAll:boolean = true;

  constructor(public apiLocation: LocationApiService) {
  }

  ngOnInit(): void {
    this
    this.getLocations();
  }

  getLocations = () => {
    this.apiLocation.loading = true;
    this.apiLocation.getAllLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.apiLocation.loading = false;
      },
      error: (e) => this.apiLocation.loading = false,
      complete: () => {},
    });
  };

  redirect(id) {
    this.showAll = false;
    this.location = this.locations[id-1];
  }

  goBack(){
    this.showAll = true;
    this.location = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  uidb64: string;
  token: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.uidb64 = this.route.snapshot.paramMap.get('uidb64');
    this.token = this.route.snapshot.paramMap.get('token');

    console.log(this.uidb64);
    console.log(this.token);

    // Agora você tem os valores de uidb64 e token e pode usá-los conforme necessário.
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/service/util/util.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  template: 'src/app/sidebar/sidebar.component',
})
export class HomeComponent implements OnInit {

  public user: any = {};

  constructor(
    private router: Router,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const res = this.util.GetStorage('user');
    this.user = res;
  }

  goNavigate(path: any) {
    this.router.navigate([path]);
  }

}

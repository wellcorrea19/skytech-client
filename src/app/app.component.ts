import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './service/auth/auth.service';
import { UtilService } from './service/util/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public user: any = {};
  public jwt : any;

  constructor(
    private util: UtilService,
    private idleService: BnNgIdleService,
    private router: Router,
    public auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.idleService.startWatching(600).subscribe((isUserInactive) => {

      if (isUserInactive) {
        const currentRoute = this.router.url;

        if(currentRoute !== '/login') {
          this.toastr.info('Sessão expirada, favor logar novamente!')
          this.idleService.resetTimer();
          this.auth.authState.next(false);
          this.util.ClearStorage();
          window.location.reload();
        }
      }
    });
    this.validSide();
  }

  validSide() {
    const token = this.util.GetStorage('token');
    this.jwt = token;
    if(this.jwt === null) {
      this.router.navigateByUrl('login');
      this.auth.authState.next(false);
    } else {
      this.router.navigateByUrl('home');
      this.auth.authState.next(true);
    }
    console.log(this.jwt);
  }

}

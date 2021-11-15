import { Injectable } from '@angular/core';
import { UtilService } from '../util/util.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState = new BehaviorSubject(false);

  constructor(
    private util: UtilService,
    private router: Router
  ) { }

  ifLoggedIn(){
    this.util.GetStorage('token').then((response: any) => {
      if (response) {
        this.authState.next(true);
      } 
    });
  }

  isAuthenticated(){
    return this.authState.value;
  }

}

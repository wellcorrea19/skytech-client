import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { UtilService } from 'src/app/service/util/util.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  public email!: string;
  public senha!: string;

  constructor(
    private util: UtilService,
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.InitializeForms();
  }

  // Função login
  InitializeForms() {
    this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([
            Validators.minLength(6),
            Validators.maxLength(40),
        ])],
        senha: ['', Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(45)
        ])]
    });
  }

  public login() {
    const params = {
      email: this.loginForm.value.email,
      senha: this.loginForm.value.senha,
    };

    if (this.loginForm.valid) {
      this.http.post('http://157.245.255.90:3001/api/auth/login', params)
        .subscribe((data: any) => {
          switch (data.error) {
            case(false):
              this.util.SetStorage('token', data.token);
              this.util.SetStorage('user', data.user);
              window.location.reload();
              this.toastr.success('Login efetuado com sucesso!');
              this.auth.authState.next(true);
              break;
            case(true):
              this.toastr.error(data.msg);
              break;
          }
      });
    } else {
      this.toastr.error('Favor preencher todos os campos!');;
    }
  }

}

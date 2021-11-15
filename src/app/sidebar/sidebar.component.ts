import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'angular-web-storage';
import { AuthService } from '../service/auth/auth.service';
import { UtilService } from '../service/util/util.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="card">

    <div class="modal-header">
      <h3 class="card-title"><i class="fas fa-user-edit mr-2"></i> Editar Dados</h3>
      <button type="button" class="close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button> 
    </div>

    <div class="card-body p-2">

        <div class="row">
          <div class="col pr-0">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
              </div>
              <input type="text" name="name" class="form-control" placeholder="Nome de Exibição" title="Não é possível editar o nome pois não altera os registros anteriores já cadastrados. Caso precise alterar, contate o administrador." disabled>
            </div>
          </div>
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
              </div>
              <input type="text" name="email" class="form-control" placeholder="exemplo@skygr.com.br">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col pr-0">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-lock"></i></span>
              </div>
              <input type="password" name="new_password" class="form-control" required placeholder="Nova senha">
            </div>
          </div>
          <div class="col">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-redo-alt"></i></span>
              </div>
              <input type="password" name="confirm_password" class="form-control" required placeholder="Confirme nova senha">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <span class="help-block"></span>
            <span class="help-block"></span>
          </div>
        </div>

        <div class="row">
          <div class="col-11 pr-0">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">Foto</span>
              </div>
              <!-- <input type="text" name="avatar" id="inputAvatarDefault" class="form-control" value="avatar.png" disabled> -->
              <div class="custom-file">
                <input type="file" name="avatar" class="custom-file-input" id="inputGroupFile01">
                <label class="custom-file-label" for="inputGroupFile01">Selecione uma foto de perfil</label>
              </div>
            </div>
          </div>
          <div class="col-12">
            <input type="checkbox" name="checkMe" id="checkMe" onclick="disableMyText()">
            <button type="submit" class="btn btn-success btn-block"><i class="far fa-check-circle mr-1"></i></button>
          </div>
        </div>

    </div>
  </div>
  `
})
// tslint:disable-next-line:component-class-suffix
export class NgbdModalConfirmAutofocus {
  constructor(public modal: NgbActiveModal) {}
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public user: any = {};

  constructor(
    private router: Router,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    private util: UtilService,
    private storage: LocalStorageService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const res = this.util.GetStorage('user');
    this.user = res;
  }

  open(name: string) {
    this.modalService.open(MODALS[name]);
  }

  goNavigate(path: any) {
    this.router.navigate([path]);
  }

  // Logout
  logout() {
    this.storage.remove('token');
    this.storage.remove('user');
    window.location.reload();
    this.auth.authState.next(false);
  }

}

const MODALS: {[name: string]: Type<any> } = {
  editdados: NgbdModalConfirmAutofocus
};

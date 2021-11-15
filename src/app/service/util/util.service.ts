import { Injectable, TemplateRef } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class UtilService {

  toasts: any[] = [];

  constructor(
    private storage: LocalStorageService,
    private sanitize: DomSanitizer,
    private toastr: ToastrService,
    
  ) { }

  public ShowLog(text: any, values: any) {
    console.log(text, values);
  }

  public SanitizeImage(imagePath: any) {
    return this.sanitize.bypassSecurityTrustStyle(`url('${imagePath}')`);
  }

  public async ShowAlert(message: any) {
    alert(message);
  }

  public SetStorage(key: string, value: any) {
    this.storage.set(key, value);
  }

  public GetStorage(key: string) {
    return this.storage.get(key);
  }

  public ClearStorage() {
    this.storage.clear();
  }
}

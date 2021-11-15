import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-soli-pedido',
  templateUrl: './soli-pedido.component.html',
  styleUrls: ['./soli-pedido.component.scss']
})
export class SoliPedidoComponent implements OnInit {

  public list: any;
  public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.
  dados: any;
  empresas: any;
  forma: any;
  tipo: any;
  sublist: any;
  solicitacao: any ={
    tiposolicitao: '',
    empresa: '',
    formapedido: '',
    datasolicitadao: '',
    expressa: '',
    valor: '',
    produtopred: '',
  }

  constructor(
    private router: Router,
    public modal: NgbActiveModal,
    public modalService: NgbModal,
    public toastr: ToastrService,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.GetInfo();
    this.GetFormaPedido();
    this.GetEmpresas();
    this.GetTipoPedido();
    this.GetPedidoItem();
  }

  // Função pegando dados
  async GetInfo() {
    const params = {
      method: 'pedidos',
      function: 'listPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe(data => {
    switch (data.error) {
      case (false):
        this.FillArray( 'list', data.list)
        console.log(data.list)
        break;
        case (true):
          this.toastr.error(data.msg);
          break;
        }
      });
    });
  }

  // Get pedido item
  async GetPedidoItem() {
    const params = {
      method: 'pedidoitem/'+this.dados.id,
      function: 'listPedidoItem',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe(data => {
      switch (data.error) {
        case (false):
          this.FillArray( 'sublist', data.list)
          break;
          case (true):
            this.toastr.error(data.msg);
            break;
          }
        });
      });
  }

  // Get tipo pedido
  async GetTipoPedido() {
    const params = {
      method: 'tipopedidos',
      function: 'listTipoPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe(data => {
      switch (data.error) {
        case (false):
          this.FillArray( 'tipo', data.list)
          break;
          case (true):
            this.toastr.error(data.msg);
            break;
          }
        });
      });
  }

  // Get empresas 
  async GetEmpresas() {
    const params = {
      method: 'empresas',
      function: 'listEmpresa',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe(data => {
    switch (data.error) {
      case (false):
        this.FillArray( 'empresas', data.list)
        console.log(data.list)
        break;
        case (true):
          this.toastr.error(data.msg);
          break;
        }
      });
    });
  }

  // Get forma pedido
  async GetFormaPedido() {
    const params = {
      method: 'formapedidos',
      function: 'listFormaPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe(data => {
    switch (data.error) {
      case (false):
        this.FillArray( 'forma', data.list)
        console.log(data.list)
        break;
        case (true):
          this.toastr.error(data.msg);
          break;
        }
      });
    });
  }

  // Get Events
  getTipo($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.tiposolicitao = $event;
    console.log($event);
  }

  getEmpresa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.empresa = $event;
    console.log(this.solicitacao.empresa);
  }

  getForma($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.formapedido = $event;
    console.log(this.solicitacao.formapedido);
  }

  getExpressa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.expressa = $event;
    console.log(this.solicitacao.expressa);
  }

  // Filtrar arrays
  FillArray(name: string, values: any) {
    var util = require('type-util');
    if (util.isArray(values)) {
      if (name === 'list') {
          this.list = values;
      }
      if (name === 'empresas') {
        this.empresas = values;
      }
      if (name === 'forma') {
        this.forma = values;
      }
      if (name === 'tipo') {
        this.tipo = values;
      }
    }
  }

  goNavigate(path: any){
    this.router.navigate([path]);
  }

  openCadastro(content: any){
    this.GetEmpresas();
    this.GetFormaPedido();
    this.modalService.open(content, { size: 'lg' });
  }

  openConsulta(content: any){
    this.GetEmpresas();
    this.GetFormaPedido();
    this.modalService.open(content, { size: 'lg' });
  }

  open(content: any, item: any, dados: boolean = false){
    if(dados){
      this.dados = item;
      this.GetPedidoItem();
    }

    this.modalService.open(content, { size: 'lg' });
  }

  close(){
    this.modalService.dismissAll();
  }

}


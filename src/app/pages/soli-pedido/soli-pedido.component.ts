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
  filteredList: any;
  public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.
  dados: any;
  empresas: any;
  forma: any;
  cidades: any;
  filteredCidades: any;
  tipo: any;
  sublist: any;

  searchValue:string ='';
  searchCidadeValue: string = '';
  propMotHelper = '0'; // 0 cadastrando proprietario, 1 cadastrando motorista

  solicitacao: any ={
    tiposolicitao: null,
    id_empresa: null,
    id_formapedido: null,
    datasolicitacao: null,
    dataconclusao: null,
    expressa: null,
    valor: null,
    produtopred: null,
  }

  proprietario: any = {
    razao: '', 
    fantasia: '', 
    cnpj: '', 
    ie: '', 
    rg: '', 
    orgao_emiss_rg: '', 
    endereco: '', 
    numero: '', 
    complemento: '',
    bairro: '', 
    ibge_endereco: '', 
    id_cidade_end: '', 
    cep: '', 
    email: '', 
    telefone: ''
  }

  motorista: any = {
    nome: '', 
    cpf: '', 
    data_nascimento: '',
    ibge_cidade_nascimento: '', 
    endereco: '', 
    bairro: '', 
    cep: '', 
    complemento: '', 
    numero: '', 
    ibge_endereco: '', 
    apelido: '', 
    sexo: '', 
    rg: '', 
    orgao_emissor_rg: '', 
    data_emiss_rg: '', 
    num_form_cnh: '', 
    num_reg_cnh: '', 
    num_segur_cnh: '', 
    num_renach_cnh: '', 
    uf_emiss_cnh: '', 
    data_emiss_cnh: '', 
    data_venc_cnh: '', 
    categoria_cnh: '', 
    dt_prim_emiss_cnh: '', 
    possui_mopp: '', 
    dt_venc_mopp: '', 
    nome_mae: '', 
    id_cidade_nasc: '', 
    id_cidade_end: '', 
    telefone: '', 
    celular: ''
  }

  veiculo: any = {
    placa: '', 
    tipo_veiculo: '', 
    chassi: '', 
    cor: '', 
    renavan: '', 
    ano_fabricacao: '', 
    ano_modelo: '',
    marca: '', 
    modelo: ''
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
    this.GetCidades();
    this.GetFormaPedido();
    this.GetEmpresas();
    this.GetTipoPedido();
    this.GetPedidoItem();
  }

  //Por enquanto está tratando pedidos que é o objeto utilizado no html desse component.
  search() {
    const data = this.searchValue.toLowerCase();
    this.filteredList = this.list;
    if (this.searchValue) {
      this.filteredList = this.list.filter(function (ele: any, i: any, array: any) {
        let match = false;
        let arrayelement = '';
        
        if (ele.protocolo) {
          arrayelement = ele.protocolo.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.id_empresa) {
          arrayelement = ele.id_empresa.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.id_formapedido) {
          arrayelement = ele.id_formapedido.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }
        
        if (ele.id_tiposolicitacao) {
          arrayelement = ele.id_tiposolicitacao.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.datasolicitacao) {
          arrayelement = ele.datasolicitacao.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.expressa) {
          arrayelement = ele.expressa.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.valor) {
          arrayelement = ele.valor.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.produtopred) {
          arrayelement = ele.produtopred.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        return match;
      });
    }
  }
  
  searchCidade() {
    const data = this.searchCidadeValue.toLowerCase();
    this.filteredCidades = this.cidades;
    if (this.searchCidadeValue) {
      this.filteredCidades = this.cidades.filter(function (ele: any) {
        let match = false;
        let arrayelement = '';

        arrayelement = ele.nome_cidade.toLowerCase();
        arrayelement.includes(data) ? match=true : null;

        return match;
      });
    }
  }

  // Função pegando dados
  async GetInfo() {
    const params = {
      method: 'solicitacoes',
      function: 'listSolicitacao',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe(data => {
    switch (data.error) {
      case (false):
        this.FillArray( 'list', data.list)
        this.filteredList = this.list;
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
        break;
        case (true):
          this.toastr.error(data.msg);
          break;
        }
      });
    });
  }
  
  // Get Cidades
  async GetCidades() {
    const params = {
      method: 'cidades',
      function: 'listCidade',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe(data => {
    switch (data.error) {
      case (false):
        this.FillArray( 'cidades', data.list)
        this.filteredCidades = this.cidades;
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
    this.solicitacao.id_tiposolicitacao = $event.target.value;
  }

  getEmpresa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.id_empresa = $event.target.value;
  }

  getForma($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.id_formapedido = $event.target.value;
  }
  
  getDataSolicitacao($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.datasolicitacao = $event.target.value;
  }

  getExpressa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.expressa = $event.target.value;
  }
  
  getValorMercadoria($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.valor = $event.target.value;
  }

  getProdutoPred($event: any) {
    this.solicitacao.produtopred = $event.target.value;
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
      if (name === 'cidades') {
        this.cidades = values;
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

  openPropMot(content: any) {
    this.propMotHelper = '0'; // Setando cadastro para proprietario
    Object.keys(this.proprietario).forEach(key => this.proprietario[key] = null);
    Object.keys(this.motorista).forEach(key => this.motorista[key] = null);
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

  // Função inserindo dados
  async insertInfo() {
    const params = {
      method: 'solicitacao',
      function: 'insertSolicitacao',
      type: 'post',
      data:this.solicitacao
    };
    this.api.AccessApi(params).then((response) => {
     response.subscribe(data => {
         switch (data.error) {
           case (false):
             this.FillArray( 'list', data.list);
             this.toastr.success('Cadastrado com sucesso');
             this.GetInfo();
             this.close();
             break;
           case (true):
             this.toastr.error(data.msg);
             break;
           }
       });
     });
  }
  
  async insertProprietario() {
    const params = {
      method: 'proprietario',
      function: 'insertProprietario',
      type: 'post',
      data:this.proprietario
    };
    this.api.AccessApi(params).then((response) => {
     response.subscribe(data => {
         switch (data.error) {
           case (false):
             this.FillArray( 'list', data.list);
             this.toastr.success('Cadastrado com sucesso');
             this.GetInfo();
             this.close();
             break;
           case (true):
             this.toastr.error(data.msg);
             break;
           }
       });
     });
  }

  async insertMotorista() {
    const params = {
      method: 'motorista',
      function: 'insertMotorista',
      type: 'post',
      data:this.motorista
    };
    this.api.AccessApi(params).then((response) => {
     response.subscribe(data => {
         switch (data.error) {
           case (false):
             this.FillArray( 'list', data.list);
             this.toastr.success('Cadastrado com sucesso');
             this.GetInfo();
             this.close();
             break;
           case (true):
             this.toastr.error(data.msg);
             break;
           }
       });
     });
  }

  async insertVeiculo() {
    const params = {
      method: 'veiculo',
      function: 'insertVeiculo',
      type: 'post',
      data:this.veiculo
    };
    this.api.AccessApi(params).then((response) => {
     response.subscribe(data => {
         switch (data.error) {
           case (false):
             this.FillArray( 'list', data.list);
             this.toastr.success('Cadastrado com sucesso');
             this.GetInfo();
             this.close();
             break;
           case (true):
             this.toastr.error(data.msg);
             break;
           }
       });
     });
  }

}


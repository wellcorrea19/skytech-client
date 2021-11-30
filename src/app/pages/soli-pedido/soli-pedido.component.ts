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
    protocolo: null,
    id_tipo_solicitao: null,
    tipo_solicitacao: null,
    id_user: null,
    id_empresa: null,
    id_pedido: null,
    id_forma_pedido: null,
    empresa: null,
    data_solicitacao: null,
    data_conclusao: null,
    expressa: null,
    valor: null,
    produto_pred: null,
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
      this.filteredList = this.list.filter((ele: any, i: any, array: any) => {
        let match = false;
        let arrayelement = '';
        
        if (ele.protocolo) {
          arrayelement = ele.protocolo.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.id_empresa) {
          for(let empresa of this.empresas) {
            if(ele.id_empresa === empresa.id) { 
              arrayelement = empresa.razaosocial.toLowerCase();
              break;
            }
          };
          arrayelement.includes(data) ? match=true : null;
        }
        
        if (ele.tipo_solicitacao) {
          arrayelement = ele.tipo_solicitacao.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.data_solicitacao) {
          arrayelement = new Date(ele.data_solicitacao).toLocaleString();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.expressa) {
          arrayelement = ele.expressa.toLowerCase();
          arrayelement.includes(data) ? match=true : null;
        }

        if (ele.valor) {
          arrayelement = ele.valor;
          String(arrayelement).includes(data) ? match=true : null;
        }

        if (ele.produto_pred) {
          arrayelement = ele.produto_pred.toLowerCase();
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
      method: 'solicitacao',
      function: 'listSolicitacao',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe((data:any) => {
        this.FillArray( 'list', data.list)
        this.filteredList = this.list;
      },
      (err:any) => {
        this.toastr.error(err.error.msg);
      });
    });
  }

  // Get pedido item
  async GetPedidoItem() {
    const params = {
      method: 'pedidoitembypedido/'+this.dados.id_pedido,
      function: 'getPedidoItemByPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data:any) => {
          this.FillArray( 'sublist', data.list)
        },
        (err:any) => {
          this.toastr.error(err.error.msg);
        });
      });
  }

  // Get tipo pedido
  async GetTipoPedido() {
    const params = {
      method: 'tipopedido',
      function: 'listTipoPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data:any) => {
          this.FillArray( 'tipo', data.list)
        },
        (err:any) => {
          this.toastr.error(err.error.msg);
        });
      });
  }

  // Get empresas 
  async GetEmpresas() {
    const params = {
      method: 'empresa',
      function: 'listEmpresa',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe((data:any) => {
        this.FillArray( 'empresas', data.list)
      },
      (err:any) => {
        this.toastr.error(err.error.msg);
      });
    });
  }

  // Get forma pedido
  async GetFormaPedido() {
    const params = {
      method: 'formapedido',
      function: 'listFormaPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe((data:any) => {
        this.FillArray( 'forma', data.list)
      },
      (err:any) => {
        this.toastr.error(err.error.msg);
      });
    });
  }
  
  // Get Cidades
  async GetCidades() {
    const params = {
      method: 'cidade',
      function: 'listCidade',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

    response.subscribe((data:any) => {
        this.FillArray( 'cidades', data.list)
        this.filteredCidades = this.cidades;
      },
      (err:any) => {
        this.toastr.error(err.error.msg);
      });
    });
  }

  // Get Events
  getTipo($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.id_tipo_solicitacao = $event.target.value;
  }

  getEmpresa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.id_empresa = $event.target.value;
  }

  getForma($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.id_forma_pedido = $event.target.value;
  }
  
  getDataSolicitacao($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.solicitacao.data_solicitacao = $event.target.value;
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
    this.solicitacao.produto_pred = $event.target.value;
  }

  // Filtrar arrays
  FillArray(name: string, values: any) {
    var util = require('type-util');
    if (util.isArray(values)) {
      if (name === 'list') {
          this.list = values;
      }
      if (name === 'sublist') {
          this.sublist = values;
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
  
  openVeiculo(content: any) {
    Object.keys(this.veiculo).forEach(key => this.veiculo[key] = null);
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
     response.subscribe((data:any) => {
          this.FillArray( 'list', data.list);
          this.toastr.success('Cadastrado com sucesso');
          this.GetInfo();
          this.close();
       },
       (err:any) => {
         this.toastr.error(err.error.msg);
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
     response.subscribe((data:any) => {
          this.FillArray( 'list', data.list);
          this.toastr.success('Cadastrado com sucesso');
          this.GetInfo();
          this.close();
       },
       (err:any) => {
         this.toastr.error(err.error.msg);
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
     response.subscribe((data:any) => {
          this.FillArray( 'list', data.list);
          this.toastr.success('Cadastrado com sucesso');
          this.GetInfo();
          this.close();
       },
       (err:any) => {
         this.toastr.error(err.error.msg);
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
      response.subscribe((data:any) => {
        this.FillArray( 'list', data.list);
        this.toastr.success('Cadastrado com sucesso');
        this.GetInfo();
        this.close();
      },
      (err:any) => {
        this.toastr.error(err.error.msg);
      });
    }).catch((error:any) => {
      console.log(error);
    });
  }

}


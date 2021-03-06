import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';
import Inputmask from 'inputmask';

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
  propList: any;
  motoList: any;
  veicList: any;
  pedidoNgTemplate: any = null;

  searchValue: string = '';
  searchCidadeValue: string = '';
  propMotHelper = '0'; // 0 cadastrando proprietario, 1 cadastrando motorista

  pedido: any = {
    id: null,
    id_empresa: null,
    id_user: null,
    id_formapedido: null,
    id_tipo_pedido: null,
    id_classificacao: null,
    dataregistro: null,
    protocolo: '',
    idexterno: null,
    situacao: null,
    dataconclusao: null,
    expressa: null,
    vlrmercadoria: null,
    produtopred: null,
    tipo_pedido: null,
    empresa: null,
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
    telefone: '',
    pedido_id: null,
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
    celular: '',
    pedido_id: null,
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
    modelo: '',
    pedido_id: null,
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
  }

  //Por enquanto está tratando pedidos que é o objeto utilizado no html desse component.
  search() {
    const data = this.searchValue.toLowerCase();
    this.filteredList = this.list;
    if (this.searchValue) {
      this.filteredList.sort((a: any, b: any) => new Date(b.dataregistro).getTime() - new Date(a.dataregistro).getTime());
      this.filteredList = this.list.filter((ele: any, i: any, array: any) => {
        let match = false;
        let arrayelement = '';

        if (ele.protocolo) {
          arrayelement = ele.protocolo.toLowerCase();
          arrayelement.includes(data) ? match = true : null;
        }

        if (ele.id_empresa) {
          for (let empresa of this.empresas) {
            if (ele.id_empresa === empresa.id) {
              arrayelement = empresa.razaosocial.toLowerCase();
              break;
            }
          };
          arrayelement.includes(data) ? match = true : null;
        }

        if (ele.tipo_pedido) {
          arrayelement = ele.tipo_pedido.toLowerCase();
          arrayelement.includes(data) ? match = true : null;
        }

        if (ele.dataregistro) {
          arrayelement = new Date(ele.dataregistro).toString();
          arrayelement.includes(data) ? match = true : null;
        }

        if (ele.expressa) {
          arrayelement = ele.expressa.toLowerCase();
          arrayelement.includes(data) ? match = true : null;
        }

        if (ele.vlrmercadoria) {
          arrayelement = ele.vlrmercadoria;
          String(arrayelement).includes(data) ? match = true : null;
        }

        if (ele.produtopred) {
          arrayelement = ele.produtopred.toLowerCase();
          arrayelement.includes(data) ? match = true : null;
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
        arrayelement.includes(data) ? match = true : null;

        return match;
      });
    }
  }

  expandTable(tableId: string) {
    const table = document.getElementById(tableId)?.classList.toggle('d-none');
  }

  // Função pegando dados
  async GetInfo() {
    const params = {
      method: 'pedido',
      function: 'listPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {

      response.subscribe((data: any) => {
        this.FillArray('list', data.list)
        this.filteredList = this.list;
        this.filteredList.sort((a: any, b: any) => new Date(b.dataregistro).getTime() - new Date(a.dataregistro).getTime());
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  // Get pedido item
  async GetPedidoItem() {
    const params = {
      method: 'pedidoitembypedido/' + this.dados.id,
      function: 'getPedidoItemByPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('sublist', data.list)
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  // Get proprietario
  async GetProprietario() {
    const pedido_id = this.pedido.id;
    const params = {
      method: `proprietariobypedido/${pedido_id}`,
      function: 'listProprietarioByPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('proprietarios', data.list)
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  // Get motorista
  async GetMotorista() {
    const pedido_id = this.pedido.id;
    const params = {
      method: `motoristabypedido/${pedido_id}`,
      function: 'listMotoristaByPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('motoristas', data.list);
        this.propList.forEach((prop:any) => {
          if(prop.motorista_id){
            this.motoList.forEach((motorista:any) => {
              motorista.proprietario = prop.razao;
            });
          }
        });
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  // Get veiculo
  async GetVeiculo() {
    const pedido_id = this.pedido.id;
    const params = {
      method: `veiculobypedido/${pedido_id}`,
      function: 'listVeiculoByPedido',
      type: 'get'
    };

    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('veiculos', data.list)
      },
        (err: any) => {
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
      response.subscribe((data: any) => {
        this.FillArray('tipo', data.list)
      },
        (err: any) => {
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

      response.subscribe((data: any) => {
        this.FillArray('empresas', data.list)
      },
        (err: any) => {
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

      response.subscribe((data: any) => {
        this.FillArray('forma', data.list)
      },
        (err: any) => {
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

      response.subscribe((data: any) => {
        this.FillArray('cidades', data.list)
        this.filteredCidades = this.cidades;
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  // Get Events
  getTipo($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.id_tipo_pedido = $event.target.value;
  }

  getEmpresa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.id_empresa = $event.target.value;
  }

  getForma($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.id_formapedido = $event.target.value;
  }

  getDataRegistro($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.dataregistro = $event.target.value;
    console.log($event.target.value)
  }

  getExpressa($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.expressa = $event.target.value;
  }

  getValorMercadoria($event: any) {
    // tslint:disable-next-line:object-literal-key-quotes
    this.pedido.vlrmercadoria = $event.target.value;
  }

  getProdutoPred($event: any) {
    this.pedido.produtopred = $event.target.value;
  }

  // Filtrar arrays
  FillArray(name: string, values: Array<any>) {
    var util = require('type-util');
    if (util.isArray(values)) {
      //pedidos
      if (name === 'list') {
        values.sort(function (a: any, b: any) {
          if (a.dataregistro > b.dataregistro) {
            return 1;
          }

          return -1;
        });
        this.list = values;
      }
      //pedido itens
      if (name === 'sublist') {
        this.sublist = values;
      }
      if (name === 'proprietarios') {
        this.propList = values;
      }
      if (name === 'veiculos') {
        console.log(values)
        this.veicList = values;
      }
      if (name === 'motoristas') {
        this.motoList = values;
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

  goNavigate(path: any) {
    this.router.navigate([path]);
  }

  openCadastro(content: any) {
    this.GetEmpresas();
    this.GetFormaPedido();
    this.modalService.open(content, { size: 'lg' });
  }

  openConsulta(content: any) {
    this.GetEmpresas();
    this.GetFormaPedido();
    this.modalService.open(content, { size: 'lg' });
  }

  openPropMot(content: any) {
    this.propMotHelper = '0'; // Setando cadastro para proprietario
    Object.keys(this.proprietario).forEach(key => this.proprietario[key] = null);
    Object.keys(this.motorista).forEach(key => this.motorista[key] = null);
    this.modalService.open(content, { size: 'lg' });

    //inputmasks proprietario
    const ibgeProprietario = document.getElementById('ibge-proprietario')!;
    Inputmask({ "mask": "9999999" }).mask(ibgeProprietario);
    const numeroProprietario = document.getElementById('numero-proprietario')!;
    Inputmask({ "mask": "99999" }).mask(numeroProprietario);
    const telefoneProprietario = document.getElementById('telefone-proprietario')!;
    Inputmask({ "mask": "(99)9{4}-9{4,5}" }).mask(telefoneProprietario);

    //inputmasks motorista
    const ibgeNascMotor = document.getElementById('ibge-nasc-motorista')!;
    Inputmask({ "mask": "9999999" }).mask(ibgeNascMotor);
    const ibgeEndMotor = document.getElementById('ibge-end-motorista')!;
    Inputmask({ "mask": "9999999" }).mask(ibgeEndMotor);
    const numFormCnhMotor = document.getElementById('num-form-cnh-motorista')!;
    Inputmask({ "mask": "9{1,10}" }).mask(numFormCnhMotor);
    const numRegCnhMotor = document.getElementById('num-reg-cnh-motorista')!;
    Inputmask({ "mask": "9{1,10}" }).mask(numRegCnhMotor);
    const telefoneMotorista = document.getElementById('telefone-motorista')!;
    Inputmask({ "mask": "(99)9{4}-9{4,5}" }).mask(telefoneMotorista);
    const celularMotorista = document.getElementById('celular-motorista')!;
    Inputmask({ "mask": "(99)9{4}-9{4,5}" }).mask(celularMotorista);
  }

  openVeiculo(content: any) {
    Object.keys(this.veiculo).forEach(key => this.veiculo[key] = null);
    this.modalService.open(content, { size: 'lg' });

    //inputmasks veiculo
    const anoFabVeic = document.getElementById('ano-fab-veiculo')!;
    Inputmask({ "mask": "9999" }).mask(anoFabVeic);
    const anoModVeic = document.getElementById('ano-mod-veiculo')!;
    Inputmask({ "mask": "9999" }).mask(anoModVeic);
  }

  pedidoDataRegistro() {
    let d = new Date();
    var datestring =
      d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2) +
      "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    this.pedido.dataregistro = datestring;
  }

  open(content: any, item: any, dados: boolean = false) {
    if (dados) {
      this.dados = item;
      this.pedido = this.dados;
      this.pedidoNgTemplate = content;
      this.GetProprietario();
      this.GetMotorista();
      this.GetVeiculo();
    }

    this.modalService.open(content, { size: 'lg' });
  }

  openVinculoProp(content: any,prop:any){
    this.proprietario = prop;
    this.GetMotorista();
    this.modalService.open(content, { size: 'lg' });
  }

  close() {
    this.modalService.dismissAll();
  }

  // Função inserindo dados
  async insertInfo() {
    const params = {
      method: 'pedido',
      function: 'insertPedido',
      type: 'post',
      data: this.pedido
    };
    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('list', data.list);
        this.toastr.success('Cadastrado com sucesso');
        this.GetInfo();
        this.close();
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  async insertProprietario() {
    this.proprietario.pedido_id = this.pedido.id;

    if (!this.proprietario.razao) {
      this.proprietario.razao = this.proprietario.fantasia
    }
    else {
      this.proprietario.fantasia = this.proprietario.razao
    }

    const params = {
      method: 'proprietario',
      function: 'insertProprietario',
      type: 'post',
      data: this.proprietario
    };
    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('list', data.list);
        this.toastr.success('Cadastrado com sucesso');
        this.GetInfo();
        this.GetProprietario();
        this.close();
        this.open(this.pedidoNgTemplate, this.pedido, true);
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  async updateProprietario() {
    this.proprietario.pedido_id = this.pedido.id;

    if (!this.proprietario.razao) {
      this.proprietario.razao = this.proprietario.fantasia
    }
    else {
      this.proprietario.fantasia = this.proprietario.razao
    }

    const params = {
      method: 'proprietario',
      function: 'updateProprietario',
      type: 'put',
      data: this.proprietario
    };
    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('list', data.list);
        this.toastr.success('Atualizado com sucesso');
        this.GetInfo();
        this.GetProprietario();
        this.close();
        this.open(this.pedidoNgTemplate, this.pedido, true);
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  async insertMotorista() {
    this.motorista.pedido_id = this.pedido.id;
    const params = {
      method: 'motorista',
      function: 'insertMotorista',
      type: 'post',
      data: this.motorista
    };
    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('list', data.list);
        this.toastr.success('Cadastrado com sucesso');
        this.GetInfo();
        this.GetMotorista();
        this.close();
        this.open(this.pedidoNgTemplate, this.pedido, true);
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    });
  }

  async insertVeiculo() {
    this.veiculo.pedido_id = this.pedido.id;
    const params = {
      method: 'veiculo',
      function: 'insertVeiculo',
      type: 'post',
      data: this.veiculo
    };
    this.api.AccessApi(params).then((response) => {
      response.subscribe((data: any) => {
        this.FillArray('list', data.list);
        this.toastr.success('Cadastrado com sucesso');
        this.GetInfo();
        this.GetVeiculo();
        this.close();
        this.open(this.pedidoNgTemplate, this.pedido, true);
      },
        (err: any) => {
          this.toastr.error(err.error.msg);
        });
    }).catch((error: any) => {
      console.log(error);
    });
  }

}


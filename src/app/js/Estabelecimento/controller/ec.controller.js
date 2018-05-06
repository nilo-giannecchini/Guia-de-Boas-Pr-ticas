angular.module("pocSPA")
	.controller("EstabelecimentoCtrl", EstabelecimentoCtrl);

EstabelecimentoCtrl.$inject = ['$rootScope', 'EstabelecimentoService'];
function EstabelecimentoCtrl($rootScope, EstabelecimentoService) {

	var ctrl = this;

	ctrl.phone = false;
	ctrl.address = false;
	ctrl.acao = "Cadastrar";
	ctrl.edit = false;
	ctrl.ListaTelefones = [];
	ctrl.ListaEnderecos = [];

	var estabelecimento = $rootScope.obj;
	if (estabelecimento) {
		ctrl.acao = "Atualizar";
		ctrl.edit = true;
		ctrl.estabelecimento = {};
		ctrl.estabelecimento.id = estabelecimento.id;
		ctrl.estabelecimento.nome = estabelecimento.nome;
		ctrl.estabelecimento.categoria = estabelecimento.categoria;

		if (estabelecimento.telefones) {
			ctrl.ListaTelefones = estabelecimento.telefones;
			ctrl.phone = true;
		}
		if (estabelecimento.enderecos) {
			ctrl.ListaEnderecos = estabelecimento.enderecos;
			ctrl.address = true;
		}
	}

	ctrl.addPhone = function (telefone) {
		var tlf = {};
		tlf.descricao = telefone.descricao;
		tlf.numero = telefone.numero;
		telefone.descricao = "";
		telefone.numero = "";
		ctrl.ListaTelefones.push(tlf);
		ctrl.phone = true;
	};

	ctrl.addAddress = function (endereco) {
		var end = {};
		end.logradouro = endereco.logradouro;
		end.uf = endereco.uf;
		end.cidade = endereco.cidade;
		end.bairro = endereco.bairro;
		end.cep = endereco.cep;
		endereco.logradouro = "";
		endereco.uf = "";
		endereco.cidade = "";
		endereco.bairro = "";
		endereco.cep = "";
		ctrl.ListaEnderecos.push(end);
		ctrl.address = true;
	};

	ctrl.click = function(){
		if (ctrl.edit)
			ctrl.doUpdate();
		else
			ctrl.doRegister();
	};

	ctrl.doRegister = function () {
		if (!ctrl.validar())
			return;

		ctrl.estabelecimento.telefones = [];
		ctrl.estabelecimento.telefones = ctrl.ListaTelefones;

		ctrl.estabelecimento.enderecos = [];
		ctrl.estabelecimento.enderecos = ctrl.ListaEnderecos;

		EstabelecimentoService.addEstabelecimento(ctrl.estabelecimento)
			.then(function () {
				ctrl.limpar();
				ctrl.message = 'Estabelecimento cadastrado com sucesso!';
			}, function () {
				ctrl.message = 'Desculpe, ocorreu um erro. Tente novamente mais tarde.';
			});
	};

	ctrl.doUpdate = function () {
		if (!ctrl.validar())
			return;

		ctrl.estabelecimento.telefones = [];
		ctrl.estabelecimento.telefones = ctrl.ListaTelefones;

		ctrl.estabelecimento.enderecos = [];
		ctrl.estabelecimento.enderecos = ctrl.ListaEnderecos;

		EstabelecimentoService.updateEstabelecimento(ctrl.estabelecimento)
			.then(function () {
				ctrl.limpar();
				ctrl.message = 'Estabelecimento atualizado com sucesso!';
			}, function () {
				ctrl.message = 'Desculpe, ocorreu um erro. Tente novamente mais tarde.';
			});
	};

	ctrl.validar = validar;
	function validar() {
		if (!ctrl.estabelecimento || !ctrl.estabelecimento.nome) {
			ctrl.message = 'Preencha o nome do estabelecimento';
			return false;
		}

		if (!ctrl.estabelecimento || !ctrl.estabelecimento.categoria) {
			ctrl.message = 'Preencha a categoria do estabelecimento';
			return false;
		}
		return true;
	}

	ctrl.limpar = limpar;
	function limpar() {
		ctrl.estabelecimento ? ctrl.estabelecimento.nome = "" : null;
		ctrl.estabelecimento ? ctrl.estabelecimento.categoria = "" : null;
		ctrl.phone = false;
		ctrl.address = false;
		ctrl.ListaTelefones = [];
		ctrl.ListaEnderecos = [];
		$rootScope.obj = null;
	};
};
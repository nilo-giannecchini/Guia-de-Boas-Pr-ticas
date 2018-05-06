angular.module("pocSPA")
	.controller("ContatoCtrl", ContatoCtrl);

ContatoCtrl.$inject = ['$rootScope', 'ContatoService'];
function ContatoCtrl($rootScope, ContatoService) {

	var ctrl = this;
	ctrl.acao = "Cadastrar";
	ctrl.edit = false;
	ctrl.phone = false;
	ctrl.ListaTelefones = [];
	ctrl.messagemError = "";

	var contato = $rootScope.obj;
	if (contato) {
		ctrl.acao = "Atualizar";
		ctrl.edit = true;
		ctrl.contato = {};
		ctrl.contato.id = contato.id;
		ctrl.contato.nome = contato.nome;
		ctrl.contato.sobrenome = contato.sobrenome;
		ctrl.contato.email = contato.email;

		if (contato.telefones) {
			ctrl.ListaTelefones = contato.telefones;
			ctrl.phone = true;
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

	ctrl.click = function(){
		if (ctrl.edit)
			ctrl.doUpdate();
		else
			ctrl.doRegister();
	};

	ctrl.doRegister = function () {
		if (!ctrl.validar())
			return;

		ctrl.contato.telefones = [];
		ctrl.contato.telefones = ctrl.ListaTelefones;

		ContatoService.addContato(ctrl.contato)
			.then(function () {
				ctrl.limpar();
				ctrl.message = 'Contato cadastrado com sucesso!';
			}, function () {
				ctrl.message = 'Desculpe, ocorreu um erro. Tente novamente mais tarde.';
			});
	};

	ctrl.doUpdate = function () {
		if (!ctrl.validar())
			return;

		ctrl.contato.telefones = [];
		ctrl.contato.telefones = ctrl.ListaTelefones;

		ContatoService.updateContato(ctrl.contato)
			.then(function () {
				ctrl.limpar();
				ctrl.message = 'Contato atualizado com sucesso!';
			}, function () {
				ctrl.message = 'Desculpe, ocorreu um erro. Tente novamente mais tarde.';
			});
	};

	ctrl.validar = validar;
	function validar() {
		if (!ctrl.contato || !ctrl.contato.nome) {
			ctrl.message = 'Preencha seu nome';
			return false;
		}

		if (!ctrl.contato || !ctrl.contato.sobrenome) {
			ctrl.message = 'Preencha seu sobrenome';
			return false;
		}

		if (!ctrl.contato || !ctrl.contato.email) {
			ctrl.message = 'Preencha seu e-mail';
			return false;
		}
		return true;
	}

	ctrl.limpar = limpar;
	function limpar() {
		ctrl.contato ? ctrl.contato.nome = "" : null;
		ctrl.contato ? ctrl.contato.sobrenome = "" : null;
		ctrl.contato ? ctrl.contato.email = "" : null;
		ctrl.phone = false;
		ctrl.ListaTelefones = [];
		$rootScope.obj = null;
	};
};
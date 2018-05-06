angular.module("pocSPA")
    .controller("HomeCtrl", HomeCtrl);

HomeCtrl.$inject = ['$rootScope', 'HomeService'];
function HomeCtrl($rootScope, HomeService) {

    var ctrl = this;

    ctrl.ListaContatos = [];
    ctrl.ListaEstabelecimentos = [];
    ctrl.phone = false;
    ctrl.phone2 = false;
    ctrl.address = false;
    ctrl.state = "#";

    function init() {

        HomeService.requestContatos()
            .then(function (response) {
                ctrl.ListaContatos = response;
            }).catch(function (error) {
                console.log(error);
            });

        HomeService.requestEstabelecimentos()
            .then(function (response) {
                ctrl.ListaEstabelecimentos = response;
            }).catch(function (error) {
                console.log(error);
            });
    };

    ctrl.openPhone = function (contato) {
        if (contato.telefones === ctrl.ListaTelefones) {
            ctrl.phone = false;
            ctrl.ListaTelefones = [];
        }
        else {
            ctrl.phone = true;
            ctrl.ListaTelefones = contato.telefones;
        }
    };

    ctrl.openPhone2 = function (contato) {
        if (contato.telefones === ctrl.ListaTelefonesEC) {
            ctrl.phone2 = false;
            ctrl.ListaTelefonesEC = [];
        }
        else {
            ctrl.phone2 = true;
            ctrl.ListaTelefonesEC = contato.telefones;
        }
    };

    ctrl.openAddress = function (estabelecimento) {
        if (estabelecimento.enderecos === ctrl.ListaEnderecos) {
            ctrl.address = false;
            ctrl.ListaEnderecos = [];
        }
        else {
            ctrl.address = true;
            ctrl.ListaEnderecos = estabelecimento.enderecos;
        }
    };

    ctrl.deleteContact = function (contato) {
        HomeService.deleteContato(contato.id)
            .then(function (response) {
                init();
                ctrl.message = 'Contato excluído com sucesso!';
            }).catch(function (error) {
                console.log(error);
            });
    };

    ctrl.deleteEC = function (estabelecimento) {
        HomeService.deleteEstabelecimento(estabelecimento.id)
            .then(function (response) {
                init();
                ctrl.message = 'Estabelecimento excluído com sucesso!';
            }).catch(function (error) {
                console.log(error);
            });
    };

    ctrl.navegar = function (state, obj) {
        $rootScope.obj = obj;
        if(state)
            ctrl.state = "#!/" + state;
    }

    ctrl.init = init();
};
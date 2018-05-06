describe("pocSPA - estabelecimento.controller", function () {

    beforeEach(module("pocSPA"));

    // Pega o controller
    // Pega o controller
    var $controller;
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    // Executa os testes
    it("fluxo padrao", function () {
        var ctrl = $controller("EstabelecimentoCtrl");
        ctrl.addPhone({});
        ctrl.click();
        ctrl.addAddress({});
        ctrl.doRegister();
        ctrl.limpar();
    });

});
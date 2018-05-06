describe("pocSPA - contato.controller", function () {

    beforeEach(module("pocSPA"));

    // Pega o controller
    // Pega o controller
    var $controller;
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    // Executa os testes
    it("fluxo padrao", function () {
        var ctrl = $controller("ContatoCtrl");
        ctrl.addPhone({});
        ctrl.click();
        ctrl.doRegister();
        ctrl.doUpdate();
        ctrl.limpar();
    });

});
describe("pocSPA - home.controller", function () {

    beforeEach(module("pocSPA"));

    // Pega o controller
    // Pega o controller
    var $controller;
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    // Executa os testes
    it("fluxo padrao", function () {
        var ctrl = $controller("HomeCtrl");
        ctrl.openPhone({});
        ctrl.openPhone2({});
        ctrl.openAddress({});
        ctrl.deleteContact({});
        ctrl.deleteEC({});
        ctrl.navegar("", {});
    });

});
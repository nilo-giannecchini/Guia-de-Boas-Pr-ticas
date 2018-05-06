describe("poc SPA - Módulo Principal", function() {
    
    beforeEach(angular.mock.module('ui.router'));

    var pocSPA = module("pocSPA");
    
    it("deve ter o módulo de pocSPA definido", function(){
       expect(pocSPA).toBeDefined(); 
    });
});
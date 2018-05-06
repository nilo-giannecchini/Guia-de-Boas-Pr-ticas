angular.module("pocSPA")
    .factory('EstabelecimentoService', EstabelecimentoService);

EstabelecimentoService.$inject = ["Services"];
function EstabelecimentoService(Services) {
    return {
        addEstabelecimento: function (estabelecimento) {
            var url = '/estabelecimentos';
            return Services.post(url, estabelecimento)
                .then(function (results) {
                    return results;
                });
        },
        updateEstabelecimento: function (estabelecimento) {
            var url = '/estabelecimentos';
            return Services.put(url, estabelecimento)
                .then(function (results) {
                    return results;
                });
        }
    };
};
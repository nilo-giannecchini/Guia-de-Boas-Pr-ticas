angular.module("pocSPA")
    .factory('ContatoService', ContatoService);

ContatoService.$inject = ["Services"];
function ContatoService(Services) {
    return {
        addContato: function (contato) {
            var url = '/contatos';
            return Services.post(url, contato)
                .then(function (results) {
                    return results;
                });
        },
        updateContato: function (contato) {
            var url = '/contatos';
            return Services.put(url, contato)
                .then(function (results) {
                    return results;
                });
        }
    };
};
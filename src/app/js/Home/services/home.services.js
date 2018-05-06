angular.module("pocSPA")
    .factory('HomeService', HomeService);

HomeService.$inject = ["Services"];
function HomeService(Services) {
    return {
        requestContatos: function () {
            var url = "/contatos";
            return Services.get(url);
        },
        requestEstabelecimentos: function () {
            var url = "/estabelecimentos";
            return Services.get(url);
        },
        deleteContato: function (id) {
            var url = "/contatos/" + id;
            return Services.delete(url);
        },
        deleteEstabelecimento: function (id) {
            var url = "/estabelecimentos/" + id;
            return Services.delete(url);
        }
    };
};
angular.module("pocSPA")
    .factory('Services', Services);

Services.$inject = ["$http"];
function Services($http) {

    var serviceBase = 'http://54.94.202.213:8080';

    var obj = {};

    obj.get = function (q, headers) {
        if (headers) {
            return $http.get(serviceBase + q, headers).then(function (results) {
                return results.data;
            });
        }
        return $http.get(serviceBase + q).then(function (results) {
            return results.data;
        }).catch(function (error) {
            return error;
        });
    };

    obj.post = function (q, object) {
        return $http.post(serviceBase + q, object).then(function (response) {
            return response.data;
        });
    };

    obj.put = function (q, object) {
        return $http.put(serviceBase + q, object).then(function (results) {
            return results.data;
        });
    };

    obj.delete = function (q) {
        return $http.delete(serviceBase + q).then(function (results) {
            return results.data;
        });
    };

    obj.open = function (q) {
        window.open(serviceBase + q);
    };

    obj.getExternal = function (q) {
        return $http.get(q).then(function (results) {
            return results.data;
        });
    };

    return obj;
};
(function(){
    'use strict';

    angular
        .module('app')
        .factory('linksService', linksService);

    linksService.$inject = ['$http', 'logger'];

    function linksService($http, logger){
        return {
            one: one,
            create: create,
            update: update,
            userList: userList,
            list: list,
            listByTag: listByTag
        };

        function one(id){
            return $http.get('/api/links/'+id)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function create(fullLink, description, tags){
            var data = {
                fullLink : fullLink,
                description : description,
                tags: tags
            };
            return $http.post('/api/links', data)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function update(id, fullLink, description, tags){
            var data = {
                fullLink : fullLink,
                description : description,
                tags: tags
            };
            return $http.put('/api/links/'+id, data)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function userList(){
            return $http.get('/api/links/my')
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function list(){
            return $http.get('/api/links')
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function listByTag(tag){
            return $http.get('/api/s/'+tag)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }


    }
})();
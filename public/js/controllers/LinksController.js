(function(){
    'use strict';

    angular
        .module('app')
        .controller('LinksController', LinksController);

    LinksController.$inject = ['linksService', '$state', '$stateParams'];

    function LinksController(linksService, $state, $stateParams){
        var vm = this;

        vm.links = [];
        vm.one = one;
        vm.create = create;
        vm.update = update;

        switch($state.current.name){
            case "links":
                list();
                break;
            case "mylinks":
                userList();
                break;
            case "tags":
                listByTag();
                break;
            default: break;
        }


        function one(){
            return linksService.one($stateParams.id)
                .then(function(data){
                    vm.link = data.link;
                    vm.link.tagsS = data.link.tags.join(', ');
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function create(){
            var tags = [];
            if(vm.link.tagsS.length) { tags = vm.link.tagsS.split(','); }
            return linksService.create(vm.link.fullLink, vm.link.description, tags)
                .then(function(data){
                    vm.link = data.link;
                    vm.link.success = data.note;
                    $state.go('links');
                })
                .then(function(err){
                    vm.err = err;
                });
        }

        function update(){
            var tags = [];
            if(vm.link.tagsS.length) { tags = vm.link.tagsS.split(','); }
            return linksService.update($stateParams.id, vm.link.fullLink, vm.link.description, tags)
                .then(function(data){
                    vm.link = data.link;
                    vm.link.tagsS = data.link.tags.join(', ');
                    vm.link.success = data.note;
                })
                .then(function(err){
                    vm.err = err;
                });
        }

        function list(){
            return linksService.list()
                .then(function(data){
                    vm.links = data.links;
                }).catch(function(err){
                    vm.err = err;
                });
        }

        function userList(){
            return linksService.userList()
                .then(function(data){
                    vm.links = data.links;
                }).catch(function(err){
                    vm.err = err;
                });
        }

        function listByTag(){
            return linksService.listByTag($stateParams.tag)
                .then(function(data){
                    vm.links = data.links;
                }).catch(function(err){
                    vm.err = err;
                });
        }

    }

})();
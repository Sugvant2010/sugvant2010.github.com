(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$state', '$rootScope', 'userService' ];


    function UserController($state, $rootScope, userService){
        var vm = this;

        vm.login = login;
        vm.forgotPass = forgotPass;
        vm.resetPass = resetPass;

        switch($state.current.name){
            case "signup":
                vm.submit = signUp;
                vm.init = function(){return true; };
                break;
            case "profile":
                vm.submit = updateProfile;
                vm.init = getProfile;
                break;
            case "logout":
                logout();
                break;
            default: break;
        }



        function login(){
            delete(vm.success);
            delete(vm.err);
            return userService.login(vm.username, vm.password)
                .then(function(res){
                    if(res.result){
                        $rootScope.userId = res.id;
                        $state.go('mylinks');
                    }else{
                        handerError(res.error);
                    }
                }).catch(function(err){
                    vm.err = err.error.errors;
                });
        }

        function logout(){
            return userService.logout().
                then(function(){
                    $rootScope.userId = false;
                    $state.go('home');
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function signUp(){
            delete(vm.success);
            delete(vm.err);
            delete(vm.note);
            return userService.signUp(vm.username, vm.email, vm.password)
                .then(function(res){
                    if(res.result){
                        $rootScope.userId = res.id;
                        $state.go('mylinks');
                    }else{
                        vm.err = res.error;
                        vm.note = res.note;
                    }
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function getProfile(){
            return userService.getProfile().
                then(function(res){
                    vm.username = res.user.username;
                    vm.email = res.user.email;
                    vm.password = res.user.password;
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function updateProfile(){
            delete(vm.success);
            delete(vm.err);
            delete(vm.note);
            return userService.updateProfile(vm.username, vm.email, vm.password)
                .then(function(res){
                    if(res.result){
                        vm.success = res.note;
                        vm.username = res.user.username;
                        vm.email = res.user.email;
                    }else{
                        vm.err = res.error;
                        vm.note = res.note;
                    }
                })
                .catch(function(err){
                    vm.err = err.error.errors;
                });
        }



        function forgotPass(){
            delete(vm.success);
            delete(vm.err);
            return userService.forgotPass(vm.email)
                .then(function(res){
                    if(res.result){
                        vm.success = res.note;
                    }else{
                        vm.err = res.note;
                    }
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function resetPass(){
            delete(vm.success);
            delete(vm.err);
            return userService.resetPass(vm.password)
                .then(function(res){
                    vm.forgot.success = res.note;
                })
                .catch(function(err){
                    vm.err = err;
                });
        }

        function handerError(err){
            vm.err = err;
        }
    }

})();

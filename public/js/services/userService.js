(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['$http', 'logger'];

    function userService($http, logger){

        return {
            login : login,
            logout : logout,
            signUp : signUp,
            getProfile: getProfile,
            updateProfile: updateProfile,
            checkSession : checkSession,
            forgotPass : forgotPass,
            resetPass : resetPass
        };

        function login(username, password){
            var data = {
                username : username,
                password : password
            };

            return $http.post( '/api/login', data)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function logout(){
            return $http.get('/api/logout')
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function signUp(username,email,password){
            var data = {
                username : username,
                email : email,
                password : password
            };

            return $http.post('/api/users', data)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function getProfile(){
            return $http.get('/api/users/my')
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function updateProfile(username,email,password){
            var data = {
                username : username,
                email : email,
                password : password
            };

            return $http.put('/api/users/my', data)
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function checkSession(){
            return $http.get('/api/checkSession')
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function forgotPass(email){
            return $http.post('/api/forgot', {email : email})
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }

        function resetPass(password){
            return $http.post('/api/reset', {email : password})
                .then(logger.defaultSuccess)
                .catch(logger.logError);
        }



    }
})();
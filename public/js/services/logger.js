(function() {
    'use strict';

    angular
        .module( "app" )
        .factory( 'logger', logger);

    logger.$inject = ['$log'];

    function logger( $log ) {
        return {
            error   : error,
            info    : info,
            success : success,
            warning : warning,
            log     : $log.log,
            defaultSuccess : defaultSuccess,
            logError: logError
        };

        function error(message) {
            $log.error("Error: " + message);
        }

        function info(message) {
            $log.info("Info: " + message);
        }

        function success(message) {
            $log.info("Success: " + message);
        }

        function warning(message) {
            $log.warn("Warning: " + message);
        }

        function defaultSuccess(res){
            info(JSON.stringify(res.data));
            return res.data;
        }

        function logError(err){
            error(err);
        }

    }

})();
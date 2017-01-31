module.exports = function(grunt){
    var request = require('request');

    grunt.loadNpmTasks('grunt-contrib-connect');

    // Keep track of proxies on this scope
    var proxies = {};

    if(grunt.option('proxy')){
        findProxies();
    }

    grunt.registerTask('serve', ['connect:server']);

    grunt.registerTask('serve:proxy', findProxies);

    grunt.config('connect', {
        server: {
            options: {
                keepalive: true,
                debug: true,
                hostname: '0.0.0.0',
                port: 9000,
                base: grunt.option('serve.dev'),
                middleware: function(connect, options, middlewares) {
                    middlewares.unshift(getProxy);
                    return middlewares;
                }
            }         
        }
    });

    function getProxy(req, res, next){
        for(var path in proxies){
            if(req.url.indexOf(path) === 0){
                var url = proxies[path] + req.url.substring(path.length);
                return req.pipe(request(url)).pipe(res);
            }
        }
        return next();
    }

    function findProxies(){
        grunt.option.flags().forEach(function(flag){
            var key = flag.substring(2, flag.indexOf('='));
            var value = flag.substring(flag.indexOf('=')+1);

            var keySuffix = key.substring(key.length-3).toLowerCase();
            var valuePrefix = value.substring(0, 4).toLowerCase();
            
            if(keySuffix == 'url' && valuePrefix == 'http'){
                var proxyPath = '/' + key.substring(0, key.length-3);
                
                proxies[proxyPath] = value;
                grunt.option(key, proxyPath);
                console.log('Proxy:' + proxyPath + ' TO ' + value);
            }
        });
    }
}
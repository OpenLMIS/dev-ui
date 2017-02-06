module.exports = function(grunt){
    var path = require('path');

    var request = require('request');
    var connect = require('connect');

    var serveIndex = require('serve-index')
    var serveStatic = require('serve-static');

    // Keep track of proxies on this scope
    var proxies = {};

    if(grunt.option('serve')){
        findProxies();

        var app = connect();
        app.use(getProxy);
        app.use(serveStatic(path.join(process.cwd(), 'build')));
        
        app.use('/', serveIndex(path.join(process.cwd(), 'build'), {'icons': true}))
        app.listen(9000);
    }

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
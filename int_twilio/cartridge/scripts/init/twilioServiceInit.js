'use strict';
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

var setParams = function(from, to, body) {
    from = encodeURIComponent(from);
    to = encodeURIComponent(to);
    var str = 'From=' + from + '&To=' + to + '&Body=' + body;

    return str;
};

var initService = {
    createRequest: function(svc, params) {
        svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
        return params;
    },
    parseResponse: function(test, client) {
        if (client.statusCode === 200) {
            //dw.system.Logger.info(client.text);
            return JSON.parse(client.text);
        }
        throw new Error('Error');
    },
};

var init = LocalServiceRegistry.createService('twilio', initService);

module.exports = {
    init: init,
    setParams: setParams,
};



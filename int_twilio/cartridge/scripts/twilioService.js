'use strict';
var twilioService = require('./init/twilioServiceInit');
var app = require('app_storefront_controllers/cartridge/scripts/app');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

var execute = function() {
    try {
        var productsID = CustomObjectMgr.getAllCustomObjects('Twilio');

        while (productsID.hasNext()) {
            var productCO = productsID.next();
            var pid = productCO.custom.productid;
            var Product = app.getModel('Product');
            var product = Product.get(pid);

            if (product.getAvailabilityModel().isInStock()) {
                var phones = JSON.parse(productCO.custom.phone);

                for (var i = 0; i < phones.length; i++) {
                    var phone = phones[i];
                    Transaction.wrap(function() {
                        try {
                            twilioService.init.call(twilioService.setParams('+18163993026', phone, 'The product: ' + product.getName() + ' is available.'));
                            CustomObjectMgr.remove(CustomObjectMgr.getCustomObject('Twilio', pid));
                        } catch (error) {
                            dw.system.Logger.error('Reason: {0}', error);
                        }
                    });
                }
            }
        }
    } catch (error) {
        dw.system.Logger.error('Reason: {0}', error);
    }
};

module.exports = {
    execute: execute,
};
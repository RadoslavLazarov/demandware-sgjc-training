'use strict';
/** @module controllers/Subscription */

var guard = require('app_storefront_controllers/cartridge/scripts/guard');
var app = require('app_storefront_controllers/cartridge/scripts/app');
var Transaction = require('dw/system/Transaction');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');

var subscriptionForm = app.getForm('subscriptionform');
var params = request.httpParameterMap;

function start() {
    app.getView({ isActive: true }).render('subscription');
}

function register() {
    subscriptionForm.clear();
    app.getView({ isActive: true }).render('subscriptionform');
}

function checkEmail() {
    var Response = require('app_storefront_controllers/cartridge/scripts/util/Response');

    var email = params.email.submitted ? params.email.value : '';
    var response = {
        emailExists: false,
        submittedEmail: email,
    };

    var checkEmail = CustomObjectMgr.getCustomObject('Subscription', email); 

    if (checkEmail !== null) {
        response.emailExists = true;
    }

    Response.renderJSON(response);
}

function handleForm() {
    var Subscription;
    var isvalid = subscriptionForm.object.valid;
    var decorator = 'util/pt_empty';

    subscriptionForm.handleAction({
        register: function() {
            var checkEmail = CustomObjectMgr.getCustomObject('Subscription', subscriptionForm.object.email.value);
            if (checkEmail !== null) {
                subscriptionForm.object.email.invalidateFormElement();
            } else if (isvalid && checkEmail === null) {
                Transaction.wrap(function() {
                    try {
                        Subscription = CustomObjectMgr.createCustomObject('Subscription', subscriptionForm.object.email.value);
                        subscriptionForm.copyTo(Subscription);
                    } catch (error) {
                        dw.system.Logger.error('Reason: {0}', error);
                    }
                });
            }
        },
    });   

    if (params.format.stringValue === 'ajax') {
        app.getView({ isActive: true, decorator: decorator }).render('subscriptionsuccess');
    }
}

function users() {
    var sortValue = params.sortby.value;
    var checkSortValue = params.sortby.value;
    var sortUsers;
    var decorator = 'pt_users';

    if (sortValue) {
        decorator = 'util/pt_empty';
        sortValue = sortValue.split('-');
        sortUsers = CustomObjectMgr.queryCustomObjects('Subscription', '', sortValue[0] + ' ' + sortValue[1]);
    } else {
        sortUsers = CustomObjectMgr.queryCustomObjects('Subscription', '', 'creationDate desc');
    }

    app.getView({ 
        isActive: true, 
        sortUsers: sortUsers, 
        sortValue: sortValue, 
        checkSortValue: checkSortValue, 
        decorator: decorator, 
    }).render('users');
}

exports.Start = guard.ensure(['get', 'https'], start);
exports.Register = guard.ensure(['get', 'https'], register);
exports.Users = guard.ensure(['get', 'https'], users);
exports.CheckEmail = guard.ensure(['get'], checkEmail);
exports.HandleForm = guard.ensure(['post'], handleForm);
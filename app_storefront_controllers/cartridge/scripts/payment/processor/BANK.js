'use strict';

/* API Includes */
var Cart = require('~/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('~/cartridge/scripts/app');

/**
 * This is where additional Bank integration would go. The current implementation simply creates a PaymentInstrument and
 * returns 'success'.
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);
    var bankForm = app.getForm('billing.paymentMethods.bank');

    var iban = bankForm.get('iban').value();

    Transaction.wrap(function () {
        cart.removeExistingPaymentInstruments('Bank');
        var paymentInstrument = cart.createPaymentInstrument('Bank', cart.getNonGiftCertificateAmount());
        paymentInstrument.custom.IBAN = iban;
    });

    return {success: true};
}

/**
 * Authorizes a payment using a credit card. The payment is authorized by using the BANK processor only
 * and setting the order no as the transaction ID. Customizations may use other processors and custom logic to
 * authorize credit card payment.
 */
function Authorize(args) {
    var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();

    Transaction.wrap(function () {
        paymentInstrument.paymentTransaction.transactionID = orderNo;
        paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
    });

    return {authorized: true};
}

/*
 * Module exports
 */

/*
 * Local methods
 */
exports.Handle = Handle;
exports.Authorize = Authorize;

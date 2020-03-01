var OrderMgr = require('dw/order/OrderMgr');
var ArrayList = require('dw/util/ArrayList');

var execute = function() {
    var orders = OrderMgr.searchOrders('', 'creationDate DESC');
    var bankOrders = new ArrayList();

    while (orders.hasNext()) {
        var foundOrder = orders.next();

        if (foundOrder.paymentInstrument.paymentMethod === 'Bank') {
            bankOrders.add(foundOrder);
        }
    }

    var pipelet = new dw.system.Pipelet('ExportOrders').execute({
        ExportFile: 'order/bankOrders.xml',
        Orders: bankOrders.iterator(),
    });
}

module.exports = {
    execute: execute,
};
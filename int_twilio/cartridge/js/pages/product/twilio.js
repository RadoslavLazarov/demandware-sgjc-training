'use strict';
var ajax = require('../../ajax');

module.exports = function () {

    $(document).on('submit', '#dwfrm_twilioform', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $container = $('#twilio-container');
        var $submitButton = $form.find('input[type="submit"]');
        var pid = $('#pid').val();

        ajax.load({
            url: $form.attr('action'),
            data: $form.serialize() + '&pid=' + pid + '&' + $submitButton.attr('name') + '=x',
            type: 'POST',
            target: $container,
        });
    });

    $(document).on('change', '#customer-phones', function () {
        var phone = $(this).val();
        var input = $('#dwfrm_twilioform_phone');
        input.val(phone);
    });
}

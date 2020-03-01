'use strict';
var ajax = require('../ajax');

exports.init = function init() {
    var checkEmail;

    $('#dwfrm_subscriptionform_email').on('change', function () {
        $.ajax({
            dataType: 'json',
            url: 'Subscription-CheckEmail',
            data: {
                email: $(this).val(),
            },
        })
            .done(function (response) {
                checkEmail = response;
            });
    });

    $('#dwfrm_subscriptionform').on('submit', function (e) {
        var $form = $(this);
        var submitButton = $form.find('input[type="submit"]').attr('name');
        var $container = $('#primary');
        e.preventDefault();

        if ($form.valid() && !checkEmail.emailExists) {
            ajax.load({
                url: $form.attr('action'),
                data: $form.serialize() + '&' + submitButton + '=x',
                type: 'POST',
                target: $container,
            });
        }

        if (checkEmail.emailExists) {
            if ($('.form-row').find('.error-message').length === 0) {
                $form.find('input[type="email"]').closest('.form-row')
                    .append('<div class="form-caption error-message">This email address already exists!</div>');
            }
        }
    });
}

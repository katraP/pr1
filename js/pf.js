var PaymentForm = {
    form_valid : 0,
    validateAction : '',
    enrollAction : '',
    $usa_states : null,
    $canada_states : null,
    onSubmitCustom : [],
    onErrorsCustom : [],
    anotherPaymentMethodPage : null,

    initialize : function() {

        if ($.browser.msie && $.browser.version.substr(0,3) == '6.0')
        {
            return;
        }

        $('#billing_details').submit(PaymentForm.onBillingDetailsSubmit);

        $('#submit_billing_form').click(function(){$('#control_tab input[name="form_name"]').val('billing_details');});
        $('#submit_store_data_request').click(function(){$('#control_tab input[name="form_name"]').val('store_data_request'); $('#billing_details').submit();});


        $('#currency').change(
            function() {
                $('#order_total span').each(function(){
                    if (!$(this).is('.select1'))
                    {
                        $(this).hide();
                    }
                });
                $('#total' + $(this).val()).show();
            }
        );
        $('#country').change(PaymentForm.disableStates);
        $('#country').keyup(PaymentForm.disableStates);
        $('#vv_info_block').show();
        $('#js_enabled').val(1);

        this.$usa_states = new $('#state optgroup[label=USA] option');
        this.$canada_states = new $('#state optgroup[label=Canada] option');
        this.disableStates();

        $('#cc_number').change(PaymentForm.onCC_Change);

        $('.stored_data_request .ppReminder').click(PaymentForm.remindPassword);
        $('.stored_data_request .ppPayBtn').click(PaymentForm.showFormStoredDataRequestEnterPassword);
        $('.stored_data_request .ppCancelBtn').click(function(){ $('#form_stored_data_request_shadow').add($(this).parent()).hide(); return false; });
    },
    onCC_Change : function()
    {
        if ($('#cc_number').val() != $('#last_cc_number').val())
        {
            $('.passed_vv').remove();

            $('#vv_enrolled').remove();
            $('#visa_verify').remove();
            $('#cavv').remove();
        }
    },
    disableStates : function()
    {
        selected = $('#state').val();
        $('#state optgroup').remove();
        $('#state option').remove();
        $('#state').append($('<option>').html(' '));
        if ($('#country').val() == 'US')
        {
            $('#state').removeAttr('disabled').find('option').remove();
            $('#state').append(PaymentForm.$usa_states);
        }
        else
        if ($('#country').val() == 'CA')
        {
            $('#state').removeAttr('disabled').find('option').remove();
            $('#state').append(PaymentForm.$canada_states);
        }
        else
        {
            $('#state').attr('disabled', 'disabled');
        }
        $('#state option').removeAttr('selected');
        $('#state option[value='+selected+']').attr('selected', 'selected');
    },
    validate : function ()
    {
        $('#submit_billing_form').val('Please wait, validating...');
        $('#submit_billing_form').addClass("validating");
        $('#billing_details input,select').attr('disabled', 'disabled');

        $.post(PaymentForm.validateAction, {
            currency:   $('#currency').val(),
            cc_number:  $('#cc_number').val(),
            exp_month:  $('#exp_month').val(),
            exp_year:   $('#exp_year').val(),
            cvv2:       $('#cvv2').val(),
            firstname:  $('#firstname').val(),
            lastname:   $('#lastname').val(),
            address:    $('#address').val(),
            city:       $('#city').val(),
            country:    $('#country').val(),
            state:      $('#state').val(),
            zip:        $('#zip').val(),
            phone:      $('#phone').val(),
            password:   $('#password').val(),
            form_name:  $('#form_name').val()
        }, PaymentForm.onValide);
        return false;
    },

    onValide : function (data)
    {
        $('#error_cc_number').hide();
        $('#error_cc_exp').hide();
        $('#error_cvv2').hide();
        $('#error_firstname').hide();
        $('#error_lastname').hide();
        $('#error_address').hide();
        $('#error_city').hide();
        $('#error_state').hide();
        $('#error_country').hide();
        $('#error_zip').hide();
        $('#error_phone').hide();
        $('#error_password').hide();

        errors = eval('(' + data + ')');

        if (errors == -1)
        {
            popupReload();
            return;
        }

        PaymentForm.form_valid = 1;
        for (error in errors)
        {
            $('#error_' + error).show();
            PaymentForm.form_valid = 0;

            if (error == 'cc_number_blocked')
            {
                if (PaymentForm.anotherPaymentMethodPage !== null)
                {
                    window.location.href = PaymentForm.anotherPaymentMethodPage;
                }
                else
                {
                    $('div.error_message').html(PaymentForm.tryAgainMessage);
                }
            }
        }

        for (var ind in PaymentForm.onErrorsCustom)
        {
            PaymentForm.onErrorsCustom[ind].call(PaymentForm, errors);
        }

        if (PaymentForm.form_valid)
        {
            PaymentForm.checkEnrollment();
        }
        else
        {
            $('#submit_billing_form').val('Submit order');
            $('#submit_billing_form').removeClass('validating');
            $('#submit_billing_form').removeClass('submit_billing_form_checking_card');

            $('#billing_details input,select').attr('disabled', '');
            PaymentForm.disableStates();
        }
    },

    checkEnrollment : function()
    {
        if (!$('#cavv').val())
        {
            $('#submit_billing_form').addClass('submit_billing_form_checking_card');
            $('#submit_billing_form').val('Please wait, checking card...');
            $('#submit_billing_form').attr('disabled', 'disabled');

            $.post(PaymentForm.enrollAction, {
                currency:   $('#currency').val(),
                cc_number:  $('#cc_number').val(),
                exp_month:  $('#exp_month').val(),
                exp_year:   $('#exp_year').val(),
                cvv2:       $('#cvv2').val(),
                firstname:  $('#firstname').val(),
                lastname:   $('#lastname').val(),
                address:    $('#address').val(),
                city:       $('#city').val(),
                country:    $('#country').val(),
                state:      $('#state').val(),
                zip:        $('#zip').val(),
                phone:      $('#phone').val(),
                form_name:  $('#form_name').val()
            }, PaymentForm.onEnrolled);
            return false;
        }

        PaymentForm.submitBillingForm('submit_billing_form');

        return false;
    },

    onEnrolled : function (data)
    {
        if (PaymentForm.form_valid)
        {
            result = eval('(' + data + ')');

            if (result == -1)
            {
                popupReload();
                return;
            }

            if (result)
            {
                $('#billing_details').append('<input type="hidden" name="vv_enrolled" value="1"/>');
            }
            else
            {
                $('#billing_details input[name=vv_enrolled]').remove();
            }

            if (result && !$('#vv_declined').val())
            {
                PaymentForm.hideFields();

                $('#billing_details').append('<input type="hidden" name="visa_verify" value="1"/>');

                $('#vv_dialog').dialog({
                    modal: true,
                    resizable: false,
                    draggable: true,
                    height: 800,
                    width: 600,
                    position: 'center',
                    title: 'Payment Authentication',
                    close: function(event, ui) {
                        PaymentForm.showFields();

                        if (event.clientX || event.keyCode == 27)
                        {
                            $('#vv_dialog iframe').remove();
                            $('#billing_details').find('input[name=visa_verify]').remove();

                            PaymentForm.submitBillingForm('submit_billing_form');
                        }
                    }
                });

                $('#billing_details input,select').attr('disabled', '');
                $.post(window.location.href, $('#billing_details').serialize(), function(data)
                {
                    if (data)
                    {
                        $('#vv_dialog').html(data);
                    }
                    else
                    {
                        PaymentForm.submitBillingForm('submit_billing_form');
                    }
                });
                return false;
            }
            else
            {
                PaymentForm.submitBillingForm('submit_billing_form');
            }
        }
    },

    submitBillingForm : function(submit_id)
    {
        $('#billing_details input,select').attr('disabled', '');
        PaymentForm.disableStates();
        $('#' + submit_id).val('Please wait, processing...');
        $('#billing_details').submit();

        popupProcessing();
    },

    hideDialog : function()
    {
        $('#vv_dialog').dialog('close');
    },

    onBillingDetailsSubmit : function()
    {
        for (var ind in PaymentForm.onSubmitCustom)
        {
            PaymentForm.onSubmitCustom[ind].call(PaymentForm, this);
        }

        if (!PaymentForm.form_valid)
        {
            return PaymentForm.validate();
        }
        return true;
    },

    fillCustomerDetails : function(fields)
    {
        if($('#use_order_details').attr('checked'))
        {
            $('#firstname').val(fields['firstname']);
            $('#lastname').val(fields['lastname']);
            $('#phone').val(fields['phone']);
            PaymentForm.fillCustomerCountry(fields);
        }
        else
        {
            $('#firstname').val('');
            $('#lastname').val('');
            $('#country').val('0');
            $('#phone').val('');
        }

        PaymentForm.disableStates();
    },

    fillCustomerCountry : function(fields)
    {
        if (fields['country'] == 'AG')
        {
            $("#country").find("option:contains('" + fields['country_name'] + "')").attr("selected", "selected");
        }
        else
        {
            $('#country').val(fields['country']);
        }
    },

    hideFields: function()
    {
        //IE bug
        $('#billing_details select').hide();
    },

    showFields: function()
    {
        //IE bug
        $('#billing_details select').show();
    },

    remindPassword: function(site, email)
    {
        $.get(
            PaymentForm.remindPasswordAction,
            function(data)
            {
                PaymentForm.showFormStoredDataRequestPasswordWasSent();
            }
        );

        return false;
    },

    showFormStoredDataRequestEnterPassword: function()
    {
        $('#error_password').hide();
        $('#form_stored_data_request_shadow, #form_stored_data_request_enter_password').show();
        return false;
    },

    showFormStoredDataRequestPasswordWasSent: function()
    {
        $('#form_stored_data_request_enter_password').hide();
        $('#form_stored_data_request_password_was_sent').show();
        return false;
    },
}

$(document).ready(
    function() {
        PaymentForm.initialize();
    }
);

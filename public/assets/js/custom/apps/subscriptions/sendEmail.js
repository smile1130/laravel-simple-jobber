"use strict";

// Class definition
var KTSendEmail = function () {
    var element;
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var form;
    var modal;

    // Init form inputs
    var handleForm = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'email': {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );

        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            const dateEls = form.querySelectorAll("input");

            // Disable form on submit click
            dateEls.forEach(dateEl => {
                dateEl.disabled = true;
            });


            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable submit button whilst loading
                        submitButton.disabled = true;

                        $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
                            }
                        });
                    
                        $.ajax({
                            url: '/sendEmail',
                            type: "POST",
                            contentType: "application/json",
                            data: JSON.stringify({
                                email: $(form.querySelector('[name="email"]')).val(),
                                subject: $(form.querySelector('[name="subject"]')).val(),
                                link: "admin.com",
                            }),
                            success: function(response) {
                                
                                if (response.success) {
                                    Swal.fire({
                                        text: "Form has been successfully submitted!",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    }).then(function (result) {
                                        if (result.isConfirmed) {
                                            // Hide modal
                                            modal.hide();
                    
                                            // Enable submit button after loading
                                            // Redirect to customers list page
                                            window.location = form.getAttribute("data-kt-redirect");
                                        }
                                    });
                                } else {
                                    Swal.fire({
                                        text: response.message,
                                        icon: "error",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn btn-primary"
                                        }
                                    });
                                }
                                
                            },
                            error: function(xhrn, status, error) {
                    
                            }
                        })
                    } else {
                        Swal.fire({
                            text: "Sorry, looks like there are some errors detected, please try again.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function(){
                            // Enable datepicker after loading
                            dateEls.forEach(dateEl => {
                                dateEl.disabled = false;
                            });           
                        });
                    }
                });
            }
        });

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            const dateEls = form.querySelectorAll("input");

            // Disable form on submit click
            dateEls.forEach(dateEl => {
                dateEl.disabled = true;
            });


            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal	
                    
                    // Enable datepicker after loading
                    dateEls.forEach(dateEl => {
                        dateEl.disabled = false;
                    });        			
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    }).then(function(){
                        // Enable datepicker after loading
                        dateEls.forEach(dateEl => {
                            dateEl.disabled = false;
                        });           
                    });
                }
            });
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();

            const dateEls = form.querySelectorAll("input");

            // Disable form on submit click
            dateEls.forEach(dateEl => {
                dateEl.disabled = true;
            });


            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal		
                    
                    // Enable datepicker after loading
                    dateEls.forEach(dateEl => {
                        dateEl.disabled = false;
                    });        
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    }).then(function(){
                        // Enable datepicker after loading
                        dateEls.forEach(dateEl => {
                            dateEl.disabled = false;
                        });           
                    });
                }
            });
        });
    }

    var initForm = function () {
        const datepicker = form.querySelector("[name=date]");

        // Handle datepicker range -- For more info on flatpickr plugin, please visit: https://flatpickr.js.org/
        $(datepicker).flatpickr({
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            mode: "range"
        });
    }

    return {
        // Public functions
        init: function () {
            // Elements
            element = document.querySelector('#kt_send_email_modal');
            modal = new bootstrap.Modal(element);

            form = document.querySelector('#kt_send_email_form');
            submitButton = form.querySelector('#kt_send_email_submit');
            cancelButton = form.querySelector('#kt_send_email_cancel');
            closeButton = element.querySelector('#kt_send_email_close');

            handleForm();
            initForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSendEmail.init();
});
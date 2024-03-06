"use strict";

// Class definition
var KTSigninGeneral = function() {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleForm = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
			form,
			{
				fields: {					
					'email': {
                        validators: {
							notEmpty: {
								message: 'Email address is required'
							},
                            emailAddress: {
								message: 'The value is not a valid email address'
							}
						}
					},
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'The password is required'
                            }
                        }
                    } 
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
				}
			}
		);		

        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;

                    const email = form.querySelector('[name="email"]').value;
                    const password = form.querySelector('[name="password"]').value;
                    console.log(email, password);
                    
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
                        }
                    });
                
                    $.ajax({
                        url: '/login',
                        type: "POST",
                        dataType: "json",
                        data: {
                            email: email,
                            password: password,
                        },
                        success: function(response) {
                            submitButton.removeAttribute('data-kt-indicator');
                            submitButton.disabled = false;
                            
                            Swal.fire({
                                text: "You have successfully logged in!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) { 
                                    form.querySelector('[name="email"]').value= "";
                                    form.querySelector('[name="password"]').value= "";                                
                                    //form.submit(); // submit form
                                    window.location = "/estimates"
                                }
                            });                          
                        },
                        error: function(res) {
                            submitButton.removeAttribute('data-kt-indicator');
                            submitButton.disabled = false;

                            Swal.fire({
                                text: res.responseJSON.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }
                    })
                    // Simulate ajax request
                    // setTimeout(function() {
                    //     // Hide loading indication
                    //     submitButton.removeAttribute('data-kt-indicator');

                    //     // Enable button
                    //     submitButton.disabled = false;

                    //     // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        
                    // }, 2000);   						
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: "Sorry, looks like there are some errors detected, please try again.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
		});
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');
            
            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSigninGeneral.init();
});

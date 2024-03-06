"use strict";

// Class definition
var KTUsersUpdateDetails = function () {
    // Shared variables
    const element = document.getElementById('kt_modal_update_details');
    const form = element.querySelector('#kt_modal_update_user_form');
    const modal = new bootstrap.Modal(element);

    // Init add schedule modal
    var initUpdateDetails = () => {

        // Close button handler
        const closeButton = element.querySelector('[data-kt-users-modal-action="close"]');
        closeButton.addEventListener('click', e => {
            e.preventDefault();

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
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // Cancel button handler
        const cancelButton = element.querySelector('[data-kt-users-modal-action="cancel"]');
        cancelButton.addEventListener('click', e => {
            e.preventDefault();

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
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // Submit button handler
        const submitButton = element.querySelector('[data-kt-users-modal-action="submit"]');
        submitButton.addEventListener('click', function (e) {
            // Prevent default button action
            e.preventDefault();

            // Show loading indication
            submitButton.setAttribute('data-kt-indicator', 'on');

            // Disable button to avoid multiple click 
            submitButton.disabled = true;

            const id =  document.getElementById('user_id').value;

            var formData = new FormData();
            var avatarFile = $(form.querySelector('[name="avatar"]'))[0].files[0]; // Get the file from input
            formData.append('avatar', avatarFile);

            formData.append('id', id);
            formData.append('name', $(form.querySelector('[name="name"]')).val());
            formData.append('email', $(form.querySelector('[name="email"]')).val());
            formData.append('description', $(form.querySelector('[name="description"]')).val());
            formData.append('currency', $(form.querySelector('[name="currency"]')).val());
            formData.append('locale', $(form.querySelector('[name="locale"]')).val());
            formData.append('companyName', $(form.querySelector('[name="company_name"]')).val());
            formData.append('companyPhone', $(form.querySelector('[name="company_phone"]')).val());
            formData.append('companyAddress1', $(form.querySelector('[name="company_address1"]')).val());
            formData.append('companyAddress2', $(form.querySelector('[name="company_address2"]')).val());
            formData.append('companyCity', $(form.querySelector('[name="company_city"]')).val());
            formData.append('companyState', $(form.querySelector('[name="company_state"]')).val());
            formData.append('companyZip', $(form.querySelector('[name="company_zip"]')).val());
            formData.append('companyCountry', $(form.querySelector('[name="company_country"]')).val());
            formData.append('companyEmail', $(form.querySelector('[name="company_email"]')).val());
            formData.append('companyPhone2', $(form.querySelector('[name="company_phone2"]')).val());
            formData.append('companyFax', $(form.querySelector('[name="company_fax"]')).val());
            formData.append('companyWebsite', $(form.querySelector('[name="company_website"]')).val());
            formData.append('industry', $(form.querySelector('[name="industry"]')).val());

            // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
                }
            });
        
            $.ajax({
                url: `/users/update`,
                type: "POST",
                processData: false,
                contentType: false,
                data: formData,
                success: function(response) {
                    
                    if (response.success) {
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;

                        // Show popup confirmation 
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
                                modal.hide();
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

        });
    }

    return {
        // Public functions
        init: function () {
            initUpdateDetails();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUsersUpdateDetails.init();
});
"use strict";

// Class definition
var KTUsersAddTax = function () {
    // Shared variables
    const element = document.getElementById('kt_modal_add_tax');
    const form = element.querySelector('#kt_modal_add_tax_form');
    const modal = new bootstrap.Modal(element);

    // Init add task modal
    var initAddTask = () => {

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'tax_name': {
                        validators: {
                            notEmpty: {
                                message: 'Tax name is required'
                            },

                        }
                    },
                    'tax_rate': {
                        validators: {
                            notEmpty: {
                                message: 'Tax rate is required'
                            },
                            between: {
                                min: 1,
                                max: 100,
                                message: 'The rate must be between 1 and 100'
                            },
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

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        // Show loading indication
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable button to avoid multiple click 
                        submitButton.disabled = true;

                        const id =  document.getElementById('user_id').value;
                        const taxName = $(element.querySelector('[name="tax_name"]')).val();
                        const taxRate = $(element.querySelector('[name="tax_rate"]')).val();

                        $.ajaxSetup({
							headers: {
								'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
							}
						});

						$.ajax({
							url: "/tax",
							type: "POST",
							contentType: "application/json",
							data: JSON.stringify({
								name: taxName,
								rate: taxRate,
                                id: id
							}),
							success: function(response) {
								submitButton.removeAttribute('data-kt-indicator');
								
								if (response.success) {
									Swal.fire({
										text: "Form has been successfully submitted!",
										icon: "success",
										buttonsStyling: false,
										confirmButtonText: "Ok, got it!",
										customClass: {
											confirmButton: "btn btn-primary"
										}
									}).then(function () {
                                            console.log(response)
											// Hide modal
											modal.hide();
											// Enable submit button after loading
											submitButton.disabled = false;

                                            let markupInput = document.getElementById("tax_list");
                                            let newHtmlContent = `<div class="d-flex align-items-center position-relative mb-7" id="markup_${response.id}">
                                                    <div class="position-absolute top-0 start-0 rounded h-100 bg-secondary w-4px"></div>
                                                    <div class="fw-bold ms-5">
                                                        <a href="#" class="fs-5 fw-bolder text-dark text-hover-primary">${taxName}</a>
                                                        <div class="fs-7 text-muted">rate: ${taxRate}</div>
                                                    </div>
                                                    <button type="button" class="btn btn-icon btn-active-light-primary w-30px h-30px ms-auto" onclick="deleteMarkup(${response.id})">
                                                        <span class="svg-icon svg-icon-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"></path>
                                                                <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"></path>
                                                                <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"></path>
                                                            </svg>
                                                        </span>
                                                    </button>
                                                </div>`
                                            markupInput.innerHTML += newHtmlContent;
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
                                    submitButton.disabled = false;
								}
								
							},
							error: function(xhrn, status, error) {
                                submitButton.disabled = false;
							}
						})
                    } else {
                        // Show popup warning. For more info check the plugin's official documentation: https://sweetalert2.github.io/
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
            }
        });
    }

    // Init update task status
    var initUpdateTaskStatus = () => {
        const allTaskMenus = document.querySelectorAll('[data-kt-menu-id="kt-users-tasks"]');

        allTaskMenus.forEach(el => {
            const resetButton = el.querySelector('[data-kt-users-update-task-status="reset"]');
            const submitButton = el.querySelector('[data-kt-users-update-task-status="submit"]');
            const taskForm = el.querySelector('[data-kt-menu-id="kt-users-tasks-form"]');

            // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
            var validator = FormValidation.formValidation(
                taskForm,
                {
                    fields: {
                        'task_status': {
                            validators: {
                                notEmpty: {
                                    message: 'Task due date is required'
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

            // Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
            $(taskForm.querySelector('[name="task_status"]')).on('change', function () {
                // Revalidate the field when an option is chosen
                validator.revalidateField('task_status');
            });

            // Reset action handler
            resetButton.addEventListener('click', e => {
                e.preventDefault();

                Swal.fire({
                    text: "Are you sure you would like to reset?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, reset it!",
                    cancelButtonText: "No, return",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        cancelButton: "btn btn-active-light"
                    }
                }).then(function (result) {
                    if (result.value) {
                        taskForm.reset(); // Reset form		
                        el.hide();
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: "Your form was not reset!.",
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

            // Submit action handler
            submitButton.addEventListener('click', e => {
                e.preventDefault();

                // Validate form before submit
                if (validator) {
                    validator.validate().then(function (status) {
                        console.log('validated!');

                        if (status == 'Valid') {
                            // Show loading indication
                            submitButton.setAttribute('data-kt-indicator', 'on');

                            // Disable button to avoid multiple click 
                            submitButton.disabled = true;

                            // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            setTimeout(function () {
                                // Remove loading indication
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
                                        el.hide();
                                    }
                                });

                                //taskForm.submit(); // Submit form
                            }, 2000);
                        } else {
                            // Show popup warning. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            Swal.fire({
                                text: "Sorry, looks like there are some errors detected, please try again.",
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "Ok, got it!",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function(){
                                //el.show();
                            });
                        }
                    });
                }
            });
        });
    }

    return {
        // Public functions
        init: function () {
            initAddTask();
            initUpdateTaskStatus();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUsersAddTax.init();
});
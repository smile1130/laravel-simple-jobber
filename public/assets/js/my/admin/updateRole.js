"use strict";

// Class definition
var KTUsersRoleUpdate = function () {
    // Shared variables
    const element = document.getElementById('kt_modal_update_role');
    const form = element.querySelector('#kt_modal_update_user_role');
    const modal = new bootstrap.Modal(element);

    // Init add task modal
    var initAddTask = () => {

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        var validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'update_role': {
                        validators: {
                            notEmpty: {
                                message: 'User Role is required'
                            },
                        }
                    }
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

                        const role =  document.getElementById('update_role').value;
                        const roleId =  document.getElementById('update_role_id').value;

                        $.ajaxSetup({
							headers: {
								'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
							}
						});

						$.ajax({
							url: `/userRole/${roleId}`,
							type: "PUT",
							contentType: "application/json",
							data: JSON.stringify({
								role: role,
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

                                            window.location = "/admin";
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
                        'role': {
                            validators: {
                                notEmpty: {
                                    message: 'User Role is required'
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

    var handleRowDeletion = function () {
        // Select all delete buttons
        const deleteButtons = document.querySelectorAll('[data-kt-subscriptions-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get customer name
                const customerName = parent.querySelectorAll('td')[0].innerText;
                const id = parent.querySelectorAll('td')[1].innerText;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + customerName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        console.log(id);
                        $.ajaxSetup({
							headers: {
								'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
							}
						});

						$.ajax({
							url: `/userRole/${id}`,
							type: "DELETE",
							contentType: "application/json",
							data: JSON.stringify({}),
							success: function(response) {

								if (response.success) {
									Swal.fire({
                                        text: "You have deleted " + customerName + "!.",
                                        icon: "success",
                                        buttonsStyling: false,
                                        confirmButtonText: "Ok, got it!",
                                        customClass: {
                                            confirmButton: "btn fw-bold btn-primary",
                                        }
                                    }).then(function () {
                                        // Remove current row
                                        window.location = "/admin";
                                    }).then(function () {
                                        // Detect checked checkboxes
                                        toggleToolbars();
                                    });
								} else {

								}

							},
							error: function(xhrn, status, error) {

							}
						})

                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: customerName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }

    return {
        // Public functions
        init: function () {
            initAddTask();
            initUpdateTaskStatus();
            handleRowDeletion();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUsersRoleUpdate.init();
});

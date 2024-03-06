"use strict";

// Class definition
var KTModalItemsAdd = function () {
    var submitButton;
    var cancelButton;
	var closeButton;
    var validator;
    var form;
    var modal;
    var table;
    var datatable;

    table = document.querySelector('#kt_subscription_products_table');

    var initDatatable = function() {
        // Init datatable --- more info on datatables: https://datatables.net/manual/    
        // $(table).DataTable().destroy();    
        // datatable = $(table).DataTable();
        datatable = $(table).DataTable();

        // console.log(datatable);
    }

    // Init form inputs
    var handleForm = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
		validator = FormValidation.formValidation(
			form,
			{
				fields: {
                    'name': {
						validators: {
							notEmpty: {
								message: 'Item name is required'
							}
						}
					},
                    'rate': {
						validators: {
							notEmpty: {
								message: 'Item rate is required'
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
        $(form.querySelector('[name="country"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validator.revalidateField('country');
        });

		// Action buttons
		submitButton.addEventListener('click', function (e) {
			e.preventDefault();

			// Validate form before submit
			if (validator) {
				validator.validate().then(function (status) {
					console.log('validated!');

					if (status == 'Valid') {
						submitButton.setAttribute('data-kt-indicator', 'on');

						// Disable submit button whilst loading
						submitButton.disabled = true;

						let taxNames = form.querySelectorAll('[name="tax_name"]');
						let taxRates = form.querySelectorAll('[name="tax_rate"]');
                        let taxChecks = form.querySelectorAll('[name="tax_check"]')
                        let totalTax = 0;

						let taxValue = [];

						for (let i = 0; i < taxNames.length; i++) {
                            if (taxChecks[i].checked) {
                                taxValue.push({name: taxNames[i].value, rate: taxRates[i].value});
                                totalTax += Number(taxRates[i].value);
                            }
						}

						let markupNames = form.querySelectorAll('[name="markup_name"]');
						let markupRates = form.querySelectorAll('[name="markup_rate"]');
                        let totalMarkup = 0;

						let markupValue = [];

						for (let i = 0; i < markupNames.length; i++) {
							markupValue.push({name: markupNames[i].value, rate: markupRates[i].value});
                            totalMarkup += Number(markupRates[i].value);
						}

						$.ajaxSetup({
							headers: {
								'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
							}
						});

						$.ajax({
							url: "/items",
							type: "POST",
							contentType: "application/json",
							data: JSON.stringify({
								name: $(form.querySelector('[name="name"]')).val(),
								rate: $(form.querySelector('[name="rate"]')).val(),
								description: $(form.querySelector('[name="description"]')).val(),
								taxes: JSON.stringify(taxValue),
								markup: JSON.stringify(markupValue)
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
									}).then(function (result) {
										if (result.isConfirmed) {
											// Hide modal
											modal.hide();
	
											// Enable submit button after loading
											submitButton.disabled = false;

											// Redirect to items list page
											// window.location = form.getAttribute("data-kt-redirect");
                                            let rowNode = datatable.row.add( [
                                                $(form.querySelector('[name="name"]')).val(),
                                                $(form.querySelector('[name="rate"]')).val(),
                                                $(form.querySelector('[name="quantity"]')).val(),
                                                totalTax,
                                                totalMarkup,
                                                $(form.querySelector('[name="rate"]')).val() * $(form.querySelector('[name="quantity"]')).val(),
                                                `<a href="#" class="btn btn-icon btn-flex btn-active-light-primary w-30px h-30px me-3" data-bs-toggle="tooltip" title="Delete" data-kt-action="product_remove">
                                                    <!--begin::Svg Icon | path: icons/duotune/general/gen027.svg-->
                                                    <span class="svg-icon svg-icon-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black" />
                                                            <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black" />
                                                            <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black" />
                                                        </svg>
                                                    </span>
                                                    <!--end::Svg Icon-->
                                                </a>`
                                            ]).draw().node();
                            
                                            // Add custom class to last column -- more info: https://datatables.net/forums/discussion/22341/row-add-cell-class
                                            $( rowNode ).find('td').eq(6).addClass('text-end');
                                            updateTotal();
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
                                    submitButton.disabled = false;
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
						});
					}
				});
			}
		});

        cancelButton.addEventListener('click', function (e) {
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


		closeButton.addEventListener('click', function(e){
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
		})
    }

    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_add_item'));

            form = document.querySelector('#kt_modal_add_item_form');
            submitButton = form.querySelector('#kt_modal_add_item_submit');
            cancelButton = form.querySelector('#kt_modal_add_item_cancel');
			closeButton = form.querySelector('#kt_modal_add_item_close');

            table = document.querySelector('#kt_subscription_products_table');

            initDatatable();

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTModalItemsAdd.init();
});
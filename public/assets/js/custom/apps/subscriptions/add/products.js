"use strict";

var KTSubscriptionsProducts = function () {
    // Shared variables
    var table;
    var datatable;
    var modalEl;
    var modal;

    var initDatatable = function() {
        // Init datatable --- more info on datatables: https://datatables.net/manual/        
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'ordering': false,
            'paging': false,
            "lengthChange": false
        });
    }

    // Delete product
    var deleteProduct = function() {
        KTUtil.on(table, '[data-kt-action="product_remove"]', 'click', function(e) {
            e.preventDefault();

            // Select parent row
            const parent = e.target.closest('tr');

            // Get customer name
            const productName = parent.querySelectorAll('td')[0].innerText;

            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "Are you sure you want to delete " + productName + "?",
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
                    Swal.fire({
                        text: "You have deleted " + productName + "!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        // Remove current row
                        datatable.row($(parent)).remove().draw();

                        updateTotal();
                    });
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
        });
    }

    // Modal handlers
    var addProduct = function() {
        // Select modal buttons
        const closeButton = modalEl.querySelector('#kt_modal_add_product_close');
        const cancelButton = modalEl.querySelector('#kt_modal_add_product_cancel');
        const submitButton = modalEl.querySelector('#kt_modal_add_product_submit');

        // Cancel button action
        cancelButton.addEventListener('click', function(e){
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

        // Add customer button handler
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Check all radio buttons
            var radio = modalEl.querySelector('input[type="radio"]:checked');
            const quantity = radio.parentNode.parentNode.querySelector('input[name="quantity"]').value;
            const markupArray = radio.parentNode.parentNode.querySelector('input[name="markup"]').value;
            const taxArray = radio.parentNode.parentNode.querySelector('input[name="taxes"]').value;

            const totalTax = JSON.parse(taxArray).reduce((prev, cur) => prev+=Number(cur.rate), 0);
            const totalMarkup = JSON.parse(markupArray).reduce((prev, cur) => prev+=Number(cur.rate), 0);
            // Define datatable row node
            var rowNode;

            if (radio && radio.checked === true) {
                rowNode = datatable.row.add( [
                    radio.getAttribute('data-kt-product-name'),
                    radio.getAttribute('data-kt-product-price'),
                    quantity,
                    totalTax,
                    totalMarkup,
                    quantity * radio.getAttribute('data-kt-product-price'),
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
            }           

            updateTotal();
            modal.hide(); // Remove modal
        });
    }

    return {
        init: function () {
            modalEl = document.getElementById('kt_modal_add_product');

            // Select modal -- more info on Bootstrap modal: https://getbootstrap.com/docs/5.0/components/modal/
            modal = new bootstrap.Modal(modalEl);

            table = document.querySelector('#kt_subscription_products_table');

            initDatatable();
            deleteProduct();
            addProduct();
        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSubscriptionsProducts.init();
});

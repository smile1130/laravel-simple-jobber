"use strict";

// Class definition
var KTSubscriptionsExport = function () {
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
                    'date': {
                        validators: {
                            notEmpty: {
                                message: 'Date range is required'
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

                        const rows = document.querySelectorAll('table tr');

                        const format = form.querySelector("[name=format]").value;

                        if (format === "cvs") {
                            submitButton.removeAttribute('data-kt-indicator');
                            const csv = [];
                            for (let i =0; i < rows.length; i++) {
                                let row = [];
                                let cols = rows[i].querySelectorAll('td, th');

                                for (let j = 0; j < cols.length; j++) {
                                    // Clean the text to remove commas and newlines
                                    var text = cols[j].innerText.replace(/,/g, '').replace(/(\r\n|\n|\r)/gm, '');
                                    row.push('"' + text + '"'); // Wrap the text with quotes
                                }
                                
                                csv.push(row.join(','));
                            }

                            let csvString = csv.join('\n');
                            let blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

                            // Create a link and download the CSV file
                            let link = document.createElement("a");
                            if (link.download !== undefined) { // Feature detection
                                // Browsers that support HTML5 download attribute
                                let url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', "clients");
                                link.setAttribute('style', 'visibility:hidden');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                Swal.fire({
                                    text: "Customer list has been successfully exported!",
                                    icon: "success",
                                    buttonsStyling: false,
                                    confirmButtonText: "Ok, got it!",
                                    customClass: {
                                        confirmButton: "btn btn-primary"
                                    }
                                }).then(function (result) {
                                    if (result.isConfirmed) {
                                        modal.hide();

                                        // Enable submit button after loading
                                        submitButton.disabled = false;

                                        // Enable datepicker after loading
                                        dateEls.forEach(dateEl => {
                                            dateEl.disabled = false;
                                        });           
                                    }
                                });
                            }
                            
                        } else if (format === "pdf") {
                            submitButton.removeAttribute('data-kt-indicator');

                            const { jsPDF } = window.jspdf;

                            let headers = ['Customer', 'Status', 'Product', 'Total','Created Date'];

                            // Instantiate jsPDF
                            let doc = new jsPDF();

                            let pdfRows = [];

                            for (let i =1; i < rows.length; i++) {
                                let row = [];
                                let cols = rows[i].querySelectorAll('td, th');

                                for (let j = 1; j < cols.length; j++) {
                                    var text = cols[j].innerText.replace(/,/g, '').replace(/(\r\n|\n|\r)/gm, '');
                                    row.push('"' + text + '"'); // Wrap the text with quotes
                                }
                                
                                pdfRows.push(row);
                            }

                            doc.autoTable({
                                head: [headers],
                                body: pdfRows,
                            });

                            doc.save('table.pdf');

                            submitButton.disabled = false;
                            dateEls.forEach(dateEl => {
                                dateEl.disabled = false;
                            });

                            modal.hide();
                        }
                        // setTimeout(function () {
                        //     submitButton.removeAttribute('data-kt-indicator');

                        //     Swal.fire({
                        //         text: "Customer list has been successfully exported!",
                        //         icon: "success",
                        //         buttonsStyling: false,
                        //         confirmButtonText: "Ok, got it!",
                        //         customClass: {
                        //             confirmButton: "btn btn-primary"
                        //         }
                        //     }).then(function (result) {
                        //         if (result.isConfirmed) {
                        //             modal.hide();

                        //             // Enable submit button after loading
                        //             submitButton.disabled = false;

                        //             // Enable datepicker after loading
                        //             dateEls.forEach(dateEl => {
                        //                 dateEl.disabled = false;
                        //             });
                        //         }
                        //     });

                        //     //form.submit(); // Submit form
                        // }, 2000);
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
            element = document.querySelector('#kt_subscriptions_export_modal');
            modal = new bootstrap.Modal(element);

            form = document.querySelector('#kt_subscriptions_export_form');
            submitButton = form.querySelector('#kt_subscriptions_export_submit');
            cancelButton = form.querySelector('#kt_subscriptions_export_cancel');
            closeButton = element.querySelector('#kt_subscriptions_export_close');

            handleForm();
            initForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTSubscriptionsExport.init();
});
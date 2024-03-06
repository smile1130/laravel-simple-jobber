"use strict";

// Class definition
var KTModalCustomerSelect = function() {
    // Private variables
    var element;
    var suggestionsElement;
    var resultsElement;
    var wrapperElement;
    var emptyElement;
    var searchObject;

    var modal;

    // Private functions
    var processs = function(search) {

        // console.log(search.inputElement.value);

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
            }
        });

        $.ajax({
            url: "/clients/search",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({searchString: `%${search.inputElement.value}%`}),
            success: function(response) {
                if (response.success) {
                    suggestionsElement.classList.add('d-none');

                    if (response.clients.length) {
                        // Hide results
                        resultsElement.innerHTML = `<div data-kt-search-element="results" class="">
                            <div class="mh-300px scroll-y me-n5 pe-5">
                        </div>`;

                        response.clients.map(client => {
                            let newHtmlContent = `<div class="d-flex align-items-center p-3 rounded-3 border-hover border border-dashed border-gray-300 cursor-pointer mb-1" data-kt-search-element="customer">
                                <div class="symbol symbol-35px symbol-circle me-5">
                                    <img alt="Pic" src="assets/media/avatars/blank.png" />
                                </div>
                                <div class="fw-bold">
                                    <span class="fs-6 text-gray-800 me-2" name="client_name">${client.name}</span>
                                    <span class="badge badge-light" name="client_email">${client.email}</span>
                                </div>
                            </div>`

                            resultsElement.children[0].insertAdjacentHTML('afterend', newHtmlContent);
                        })

                        resultsElement.classList.add('d-none');
                        // Show empty message
                        emptyElement.classList.remove('d-none');
                    } else {
                        // Show results
                        resultsElement.classList.remove('d-none');
                        // Hide empty message
                        emptyElement.classList.add('d-none');
                    }
                }
                search.complete();
            },
            error: function(xhrn, status, error) {

            }
        })

        var timeout = setTimeout(function() {
            var number = KTUtil.getRandomInt(1, 6);

            // Hide recently viewed
            suggestionsElement.classList.add('d-none');

            if (number === 3) {
                // Hide results
                resultsElement.classList.add('d-none');
                // Show empty message
                emptyElement.classList.remove('d-none');
            } else {
                // Show results
                resultsElement.classList.remove('d-none');
                // Hide empty message
                emptyElement.classList.add('d-none');
            }

            // Complete search
            search.complete();
        }, 1500);
    }

    var clear = function(search) {
        // Show recently viewed
        suggestionsElement.classList.remove('d-none');
        // Hide results
        resultsElement.classList.add('d-none');
        // Hide empty message
        emptyElement.classList.add('d-none');
    }

    // Public methods
	return {
		init: function() {
            // Elements
            element = document.querySelector('#kt_modal_customer_search_handler');
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_customer_search'));

            if (!element) {
                return;
            }

            wrapperElement = element.querySelector('[data-kt-search-element="wrapper"]');
            suggestionsElement = element.querySelector('[data-kt-search-element="suggestions"]');
            resultsElement = element.querySelector('[data-kt-search-element="results"]');
            emptyElement = element.querySelector('[data-kt-search-element="empty"]');

            // Initialize search handler
            searchObject = new KTSearch(element);

            // Search handler
            searchObject.on('kt.search.process', processs);

            // Clear handler
            searchObject.on('kt.search.clear', clear);

            // Handle select
            KTUtil.on(element, '[data-kt-search-element="customer"]', 'click', function() {
                document.getElementById("estimate_customer_name").innerHTML = this.querySelector('[name="client_name"]').innerHTML;
                document.getElementById("estimate_customer_email").innerHTML = this.querySelector('[name="client_email"]').innerHTML;
                document.getElementById("summary_customer_name").innerHTML = this.querySelector('[name="client_name"]').innerHTML;
                document.getElementById("summary_customer_email").innerHTML = this.querySelector('[name="client_email"]').innerHTML;
                modal.hide();
            });
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalCustomerSelect.init();
});

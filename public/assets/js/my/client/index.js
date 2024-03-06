function showClient(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `clients/${id}`,
        type: 'GET',
        success: function(response) {
            // Handle the response here
            console.log('Data retrieved:', response);
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_edit_customer'));
            modal.show();

            form = document.querySelector('#kt_modal_edit_customer_form');
            $(form.querySelector('[name="name"]')).val(response.client.name);
            $(form.querySelector('[name="email"]')).val(response.client.email);
            $(form.querySelector('[name="phone"]')).val(response.client.phone);
            $(form.querySelector('[name="phone2"]')).val(response.client.phone2);
            $(form.querySelector('[name="address1"]')).val(response.client.address1);
            $(form.querySelector('[name="address2"]')).val(response.client.address2);
            $(form.querySelector('[name="city"]')).val(response.client.city);
            $(form.querySelector('[name="state"]')).val(response.client.state);
            $(form.querySelector('[name="zip"]')).val(response.client.zip);
            $(form.querySelector('[name="description"]')).val(response.client.description);
            $(form.querySelector('[name="submit"]')).val(response.client.id);
        },
        error: function(xhr, status, error) {
            // Handle errors here
            console.error('Error fetching data:', error);
        }
    });
}

function exitShow() {
	modal.hide();
}

function saveEdit() {
    let id = $(form.querySelector('[name="submit"]')).val();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/clients/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            name: $(form.querySelector('[name="name"]')).val(),
            email: $(form.querySelector('[name="email"]')).val(),
            phone: $(form.querySelector('[name="phone"]')).val(),
            phone2: $(form.querySelector('[name="phone2"]')).val(),
            description: $(form.querySelector('[name="description"]')).val(),
            address1: $(form.querySelector('[name="address1"]')).val(),
            address2: $(form.querySelector('[name="address2"]')).val(),
            city: $(form.querySelector('[name="city"]')).val(),
            state: $(form.querySelector('[name="state"]')).val(),
            zip: $(form.querySelector('[name="postcode"]')).val(),
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
}
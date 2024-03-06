function deleteMarkup(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/markup/${id}`,
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
            Swal.fire({
                text: "Are you sure you want to delete?",
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
                        text: "You have deleted!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        // Remove current row
                        document.getElementById(`markup_${id}`).remove();
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: " was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        },
        error: function(xhrn, status, error) {

        }
    })
}

function deleteTax(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/tax/${id}`,
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify({}),
        success: function(response) {
            Swal.fire({
                text: "Are you sure you want to delete?",
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
                        text: "You have deleted!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(function () {
                        // Remove current row
                        document.getElementById(`tax_${id}`).remove();
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: " was not deleted.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        },
        error: function(xhrn, status, error) {

        }
    })
}
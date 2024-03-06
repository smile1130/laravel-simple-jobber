function setUser(id) {
    document.getElementById("selectedUser").value = id;
}

function getUpdateUserRole(title, id) {
    document.getElementById("update_role").value = title;
    document.getElementById("update_role_id").value = id;
}

function setRolePermission() {

    const selectElement = document.getElementById('set_role_permission');
    const id = selectElement.value;

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `userRole/${id}`,
        type: 'GET',
        success: function (response) {
            const res = JSON.parse(response.data);
            // const data = [3, 5, 7, 8, 12];
            const data = [res.customerPermission, res.itemPermission, res.estimatePermission, res.invoicePermission, res.userPermission];
            console.log(data);
            const rows = document.getElementById("permission_tbody").querySelectorAll(['tr']);
            for (let i = 0; i < rows.length; i++) {
                rows[i].querySelector('[name="list_view_permission"]').checked = Math.floor(data[i] / 16);
                rows[i].querySelector('[name="individual_view_permission"]').checked = Math.floor((data[i] % 16) / 8);
                rows[i].querySelector('[name="add_view_permission"]').checked = Math.floor((data[i] % 8) / 4);
                rows[i].querySelector('[name="update_permission"]').checked = Math.floor((data[i] % 4) / 2);
                rows[i].querySelector('[name="delete_permission"]').checked = Math.floor(data[i] % 2);
            }
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.error('Error fetching data:', error);
        }
    });
}

function savePremissions() {
    const selectElement = document.getElementById('set_role_permission');
    const id = selectElement.value;

    let data = [];
    const rows = document.getElementById("permission_tbody").querySelectorAll(['tr']);
    for (let i = 0; i < rows.length; i++) {
        let tmp = 0;
        if (rows[i].querySelector('[name="list_view_permission"]').checked)
            tmp += 16;
        if (rows[i].querySelector('[name="individual_view_permission"]').checked)
            tmp += 8;
        if (rows[i].querySelector('[name="add_view_permission"]').checked)
            tmp += 4;
        if (rows[i].querySelector('[name="update_permission"]').checked)
            tmp += 2;
        if (rows[i].querySelector('[name="delete_permission"]').checked)
            tmp += 1;
        data.push(tmp);
    }
    console.log(data);

    Swal.fire({
        text: "Are you sure you want to update?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, Update!",
        cancelButtonText: "No, cancel",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(function (result) {
        if (result.value) {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
                }
            });

            $.ajax({
                url: 'userRole/updatePermission',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    customerPermission: data[0],
                    itemPermission: data[1],
                    estimatePermission: data[2],
                    invoicePermission: data[3],
                    userPermission: data[4],
                    id: Number(id)
                }),
                success: function (response) {

                },
                error: function (xhr, status, error) {
                    // Handle errors here
                    console.error('Error fetching data:', error);
                }
            });

        } else if (result.dismiss === 'cancel') {
            Swal.fire({
                text: "This role was not updated.",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn fw-bold btn-primary",
                }
            });
        }
    });
}

setRolePermission();

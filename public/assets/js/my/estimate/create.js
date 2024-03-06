KTUtil.onDOMContentLoaded(function () {
    $("#kt_modal_add_schedule_datepicker").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
});

function addTaxes() {
    let taxInput = document.getElementById("item_taxes");
    let taxName = document.getElementById("new_tax_name").value;
    let taxRate = document.getElementById("new_tax_rate").value;
    if (taxName && taxRate)  {
        let newHtmlContent = `<div class="row" id="item_taxes">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="tax_name" value="${taxName}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="tax_rate" value="${taxRate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex align-items-center justify-content-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value="" name="tax_check"/>
                                    </div>
                                </div>
                            </div>`
        taxInput.insertAdjacentHTML('afterend', newHtmlContent);
        document.getElementById("new_tax_name").value = "";
        document.getElementById("new_tax_rate").value = "";
    }
}

function addMarkups() {
    let markupInput = document.getElementById("item_markups");
    let markupName = document.getElementById("new_markup_name").value;
    let markupRate = document.getElementById("new_markup_rate").value;
    if (markupName && markupRate) {
        let newHtmlContent = `<div class="row" id="item_markupes">
                            <div class="col-5 p-1">
                                <input type="text" class="form-control form-control-solid" name="markup_name" value="${markupName}" disabled/>
                            </div>
                            <div class="col-5 p-1">
                                <input type="number" class="form-control form-control-solid" name="markup_rate" value="${markupRate}" disabled/>
                            </div>
                        </div>`
        markupInput.insertAdjacentHTML('afterend', newHtmlContent);
        document.getElementById("new_markup_name").value = "";
        document.getElementById("new_markup_rate").value = "";
    }
}

function updateTotal() {
    const rows = document.querySelector('#kt_subscription_products_table').querySelector(['tbody']).querySelectorAll(['tr']);
    if (rows.length === 1 && rows[0].children[5] === undefined) {
        document.getElementById("subtotal").value = 0;
        document.getElementById("total_tax").value = 0;
        document.getElementById("total_price").innerHTML = "0$";
        document.getElementById("summary_total_price").innerHTML = "0$";
    } else {
        let subtotal = 0;
        let totalTax = 0;
        rows.forEach((node) => {
            subtotal += Number(node.children[5].innerHTML);
            totalTax += Number(node.children[5].innerHTML) * Number(node.children[3].innerHTML) / 100
        })
        // console.log(subtotal);
        document.getElementById("subtotal").value = subtotal;
        document.getElementById("total_tax").value = totalTax;
        document.getElementById("total_price").innerHTML = (subtotal + totalTax);
        document.getElementById("summary_total_price").innerHTML = (subtotal + totalTax) + "$";
    }
}

function paymentSchedule() {
    const value = document.getElementById("payment_schedule_input").value;
    const paymentNode = document.getElementById("payment_schedule");
    const newPaymentContent = `<div class="row mb-3">
                                <div class="col-10"></div>
                                <div class="col-2">
                                    <input type="text" class="form-control form-control-sm form-control-solid text-end" name="payment_step" value="${value}%" disabled/>
                                </div>
                            </div>`
    paymentNode.insertAdjacentHTML('afterend', newPaymentContent);
}

function submitEstimate(state) {
    const clientEmail = document.getElementById("estimate_customer_email").innerHTML;
    const clientName = document.getElementById("estimate_customer_name").innerHTML;
    const estimateNo = document.getElementById("estimate_no").value;
    const estimateDate = document.getElementById("kt_modal_add_schedule_datepicker").value;
    const phoneNumber = document.getElementById("estimate_phone").value;

    const rows = document.querySelector('#kt_subscription_products_table').querySelector(['tbody']).querySelectorAll(['tr']);
    let estimateProducts = [];
    rows.forEach((node) => {
        estimateProducts.push({
            name: node.children[0].innerHTML,
            rate: node.children[1].innerHTML,
            quantity: node.children[2].innerHTML,
            tax: node.children[3].innerHTML,
            markup: node.children[4].innerHTML,
            total: node.children[5].innerHTML
        })
    })
    const subtotal = document.getElementById("subtotal").value;
    const markup = document.getElementById('final_markup').value;
    const discount = document.getElementById("final_discount").value;
    const deposit = document.getElementById("deposit").value;
    const tax = document.getElementById('total_tax').value;
    const paymentSchedule = [];
    document.querySelectorAll('[name="payment_step"]').forEach((node) => {
        paymentSchedule.push(node.value);
    });
    const total = document.getElementById("total_price").innerHTML;

    const signature = {
        client:document.getElementById("client_signature").checked,
        my: document.getElementById("my_signature").checked
    }
    const description = document.getElementById("estimate_description").value;
    const homeownerFinance = document.getElementById("homeowner_finance").value;

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: '/estimates',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            clientEmail: clientEmail,
            clientName: clientName,
            no: estimateNo,
            date: estimateDate,
            phone: phoneNumber,
            items: JSON.stringify(estimateProducts),
            subtotal: subtotal,
            markup: markup,
            tax: tax,
            discount: discount,
            deposit: deposit,
            paymentSchedule: JSON.stringify(paymentSchedule),
            total: total,
            signature: JSON.stringify(signature),
            description: description,
            homeownerFinance: homeownerFinance,
            state: state
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

function updateEstimate(id) {
    console.log(id);
    const clientEmail = document.getElementById("estimate_customer_email").innerHTML;
    const clientName = document.getElementById("estimate_customer_name").innerHTML;
    const estimateNo = document.getElementById("estimate_no").value;
    const estimateDate = document.getElementById("kt_modal_add_schedule_datepicker").value;
    const phoneNumber = document.getElementById("estimate_phone").value;

    const rows = document.querySelector('#kt_subscription_products_table').querySelector(['tbody']).querySelectorAll(['tr']);
    let estimateProducts = [];
    rows.forEach((node) => {
        estimateProducts.push({
            name: node.children[0].innerHTML,
            quantity: node.children[1].innerHTML,
            tax: node.children[2].innerHTML,
            markup: node.children[3].innerHTML,
            total: node.children[4].innerHTML
        })
    })
    const subtotal = document.getElementById("subtotal").value;
    const markup = document.getElementById('final_markup').value;
    const discount = document.getElementById("final_discount").value;
    const deposit = document.getElementById("deposit").value;
    const tax = document.getElementById('subtotal').value;
    const paymentSchedule = [];
    document.querySelectorAll('[name="payment_step"]').forEach((node) => {
        paymentSchedule.push(node.value);
    });
    const total = document.getElementById("total_price").innerHTML;

    const signature = {
        client:document.getElementById("client_signature").checked,
        my: document.getElementById("my_signature").checked
    }
    const description = document.getElementById("estimate_description").value;
    const homeownerFinance = document.getElementById("homeowner_finance").value;
    const state = document.getElementById("invoice_state").value;

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/estimates/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            clientEmail: clientEmail,
            clientName: clientName,
            no: estimateNo,
            date: estimateDate,
            phone: phoneNumber,
            items: JSON.stringify(estimateProducts),
            subtotal: subtotal,
            markup: markup,
            tax: tax,
            discount: discount,
            deposit: deposit,
            paymentSchedule: JSON.stringify(paymentSchedule),
            total: total,
            signature: JSON.stringify(signature),
            description: description,
            homeownerFinance: homeownerFinance,
            state: state
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

function showItem(id) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `items/${id}`,
        type: 'GET',
        success: function(response) {
            // Handle the response here
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_edit_item'));
            modal.show();

            form = document.querySelector('#kt_modal_edit_item_form');
            $(form.querySelector('[name="name"]')).val(response.item.name);
            $(form.querySelector('[name="rate"]')).val(response.item.rate);
            $(form.querySelector('[name="description"]')).val(response.item.description);
            $(form.querySelector('[name="submit"]')).val(response.item.id);

            let taxInput = document.getElementById("custom_item_taxes");

            let newHtmlContent = "";
            JSON.parse(response.item.taxes).map(tax => {
                newHtmlContent += `<div class="row">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="tax_name" value="${tax.name}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="tax_rate" value="${tax.rate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value="" name="tax_check" checked/>
                                    </div>
                                </div>
                            </div>`
            })

            response.taxes.map(tax => {
                if(JSON.parse(response.item.taxes).findIndex(item => item.name === tax.name) < 0) {
                    newHtmlContent += `<div class="row">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="tax_name" value="${tax.name}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="tax_rate" value="${tax.rate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value="" name="tax_check"/>
                                    </div>
                                </div>
                            </div>`
                }
            })
            taxInput.innerHTML = newHtmlContent;

            let markupInput = document.getElementById("custom_item_markups");

            let markupHtmlContent = "";
            JSON.parse(response.item.markup).map(markup => {
                markupHtmlContent += `<div class="row">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="markup_name" value="${markup.name}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="markup_rate" value="${markup.rate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value="" name="markup_check" checked/>
                                    </div>
                                </div>
                            </div>`
            })

            response.markups.map(markup => {
                if(JSON.parse(response.item.markup).findIndex(item => item.name === markup.name) < 0) {
                    markupHtmlContent += `<div class="row">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="markup_name" value="${markup.name}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="markup_rate" value="${markup.rate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value="" name="markup_check"/>
                                    </div>
                                </div>
                            </div>`
                }
            })
            markupInput.innerHTML = markupHtmlContent;
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

    let taxNames = form.querySelectorAll('[name="tax_name"]');
    let taxRates = form.querySelectorAll('[name="tax_rate"]');
    let taxChecks = form.querySelectorAll('[name="tax_check"]');

    let taxValue = [];

    for (let i = 0; i < taxNames.length; i++) {
        if (taxChecks[i].checked) {
            taxValue.push({name: taxNames[i].value, rate: taxRates[i].value});
        }
    }

    let markupNames = form.querySelectorAll('[name="markup_name"]');
    let markupRates = form.querySelectorAll('[name="markup_rate"]');

    let markupValue = [];

    for (let i = 0; i < markupNames.length; i++) {
        markupValue.push({name: markupNames[i].value, rate: markupRates[i].value});
    }

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/items/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            name: $(form.querySelector('[name="name"]')).val(),
            rate: $(form.querySelector('[name="rate"]')).val(),
            description: $(form.querySelector('[name="description"]')).val(),
            taxes: JSON.stringify(taxValue),
            markup: JSON.stringify(markupValue)
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
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
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

function editAddTaxes() {
    let taxInput = document.getElementById("edit_item_taxes");
    let taxName = document.getElementById("edit_new_tax_name").value;
    let taxRate = document.getElementById("edit_new_tax_rate").value;
    if (taxName && taxRate)  {
        let newHtmlContent = `<div class="row" id="item_taxes">
                                <div class="col-5 p-1">
                                    <input type="text" class="form-control form-control-solid" name="tax_name" value="${taxName}" disabled/>
                                </div>
                                <div class="col-5 p-1">
                                    <input type="number" class="form-control form-control-solid" name="tax_rate" value="${taxRate}" disabled/>
                                </div>
                                <div class="col-1 p-1 d-flex justify-content-center align-items-center">
                                    <div class="form-check form-check-custom form-check-solid form-check-lg">
                                        <input class="form-check-input" type="checkbox" value=""/>
                                    </div>
                                </div>
                            </div>`
        taxInput.insertAdjacentHTML('afterend', newHtmlContent);
        document.getElementById("edit_new_tax_name").value = "";
        document.getElementById("edit_new_tax_rate").value = "";
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

function editAddMarkups() {
    let markupInput = document.getElementById("edit_item_markups");
    let markupName = document.getElementById("edit_new_markup_name").value;
    let markupRate = document.getElementById("edit_new_markup_rate").value;
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
        document.getElementById("edit_new_markup_name").value = "";
        document.getElementById("edit_new_markup_rate").value = "";
    }
}
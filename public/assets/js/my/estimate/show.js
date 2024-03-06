function updateState(id, state) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': document.getElementsByName("_token")[0].value
        }
    });

    $.ajax({
        url: `/estimates/status`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            id: id,
            state: state
        }),
        success: function(response) {
            
            if (response.success) {
                Swal.fire({
                    text: "Status successfully changed!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        window.location.reload(true);
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

async function print() {

    const { jsPDF } = window.jspdf;
    const element = document.getElementById("my_content");

    // Capture the element rendering and get a canvas
    // const canvas = await html2canvas(element);
    
    // Convert the canvas to a data URL
    // const imgData = canvas.toDataURL('image/png');
    
    // Create a new jsPDF instance
    const pdf = new jsPDF();
    
    // Calculate the number of pages and dimensions for each page
    // const imgProps = pdf.getImageProperties(imgData);
    // const pdfWidth = pdf.internal.pageSize.getWidth();
    // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add the image to the PDF
    // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Save the PDF
    // pdf.save('download.pdf');

    pdf.html(element, {
        callback: function (pdf) {
          // This will remove any blank pages at the end of the document
          const pageCount = pdf.internal.getNumberOfPages();
          for (let i = pageCount; i > 0; i--) {
            if (i > 2) {
                pdf.deletePage(i);
            }
          }
          var dataUri = pdf.output('bloburl'); // Get the PDF as a data URI
          window.open(dataUri, '_blank'); 
        },
        x: 10,
        y: 10,
        // Adjust the width of the HTML rendering
        width: pdf.internal.pageSize.getWidth() - 20, // Subtract margins
        windowWidth: element.scrollWidth, // Try adjusting this value
      });
}
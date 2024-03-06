@extends('layouts.default')

@section('toolbar')
<div id="kt_toolbar_container" class="container-xxl d-flex flex-stack flex-wrap">
    <!--begin::Page title-->
    <div class="page-title d-flex flex-column me-3">
        <!--begin::Title-->
        <h1 class="d-flex text-dark fw-bolder my-1 fs-3">
            @if($invoice->state < 4)
                Estimate
            @else
                Invoice
            @endif
        </h1>
        <!--end::Title-->
        <!--begin::Breadcrumb-->
        <ul class="breadcrumb breadcrumb-dot fw-bold text-gray-600 fs-5 my-1">
            <!--begin::Item-->
            <li class="breadcrumb-item text-gray-600">
                <a href="/estimate" class="text-gray-600 text-hover-primary">Home</a>
            </li>
            <!--end::Item-->
            <!--begin::Item-->
            <li class="breadcrumb-item text-gray-600">
                @if($invoice->state < 4)
                    Estimate
                @else
                    Invoice
                @endif
            </li>
            <!--begin::Item-->
            <li class="breadcrumb-item text-gray-500">View</li>
            <!--end::Item-->
        </ul>
        <!--end::Breadcrumb-->
    </div>
    <!--end::Page title-->
    <!--begin::Actions-->
    <div class="d-flex align-items-center py-2 py-md-1">
        <!--begin::Button-->
        @csrf
        
        @if($invoice->state == 2 || $invoice->state == 3)
        <a class="btn btn-light-primary fw-bolder me-3" onclick="updateState({{ $invoice->id}}, 1)">Pending</a>
        @endif

        @if($invoice->state == 1 || $invoice->state == 3)
        <a class="btn btn-light-success fw-bolder me-3" onclick="updateState({{ $invoice->id}}, 2)">Approved</a>
        @endif

        @if($invoice->state == 1 || $invoice->state == 2)
        <a class="btn btn-light-danger fw-bolder me-3" onclick="updateState({{ $invoice->id}}, 3)">Declined</a>
        @endif

        <a class="btn btn-success fw-bolder me-3" onclick="print()">View & Print PDF </a>

        @if($invoice->state < 4)
        <a class="btn btn-primary fw-bolder" id="kt_toolbar_primary_button" onclick="updateState({{ $invoice->id}}, 4)">Generate Invoice</a>
        @endif

        <!--end::Button-->
    </div>
    <!--end::Actions-->
</div>
@endsection

@section('contents')
<div class="content flex-row-fluid" id="kt_content">
    <!--begin::Invoice 2 main-->
    <div class="card">
        <!--begin::Body-->
        <div class="card-body p-lg-20">
            <!--begin::Layout-->
            <div class="d-flex flex-column flex-xl-row">
                <!--begin::Content-->
                <div class="flex-lg-row-fluid me-xl-18 mb-10 mb-xl-0">
                    <!--begin::Invoice 2 content-->
                    <div class="mt-n1" id="my_content">
                        <!--begin::Top-->
                        <div class="d-flex flex-stack pb-10">
                            <!--begin::Logo-->
                            <!-- <a href="#"> -->
                                <img alt="Logo" src="assets/media/logos/contractor-logo.png" style="width: 100px"/>
                            <!-- </a> -->
                            <!--end::Logo-->
                            <!--begin::Action-->
                            
                            <!--end::Action-->
                        </div>
                        <!--end::Top-->
                        <!--begin::Wrapper-->
                        <div class="m-0">
                            <!--begin::Label-->
                            <div class="fw-bolder fs-1 text-gray-800 mb-8">
                            @if($invoice->state < 4)
                                Estimate
                            @else
                                Invoice
                            @endif
                                 #{{ $invoice->no }}
                            </div>
                            <!--end::Label-->
                            <!--begin::Row-->
                            <div class="row g-5 mb-11">
                                <!--end::Col-->
                                <div class="col-sm-6">
                                    <!--end::Label-->
                                    <div class="fw-bold fs-5 text-gray-600 mb-1">Issue Date:</div>
                                    <!--end::Label-->
                                    <!--end::Col-->
                                    <div class="fw-bolder fs-4 text-gray-800">{{ $invoice->created_at->format('Y-m-d') }}</div>
                                    <!--end::Col-->
                                </div>
                                <!--end::Col-->
                                <!--end::Col-->
                                <div class="col-sm-6">
                                    <!--end::Label-->
                                    <div class="fw-bold fs-5 text-gray-600 mb-1">Due Date:</div>
                                    <!--end::Label-->
                                    <!--end::Info-->
                                    <div class="fw-bolder fs-4 text-gray-800 d-flex align-items-center flex-wrap">
                                        <span class="pe-2">{{ $invoice->dueTo }}</span>
                                        <span class="fs-5 text-danger d-flex align-items-center">
                                        <span class="bullet bullet-dot bg-danger me-2"></span>Due in 7 days</span>
                                    </div>
                                    <!--end::Info-->
                                </div>
                                <!--end::Col-->
                            </div>
                            <!--end::Row-->
                            <!--begin::Row-->
                            <div class="row g-5 mb-12">
                                <!--end::Col-->
                                <div class="col-sm-6">
                                    <!--end::Label-->
                                    <div class="fw-bold fs-5 text-gray-600 mb-1">Issue For:</div>
                                    <!--end::Label-->
                                    <!--end::Text-->
                                    <div class="fw-bolder fs-4 text-gray-800">{{ $invoice->clientName }}</div>
                                    <!--end::Text-->
                                    <!--end::Description-->
                                    <div class="fw-bold fs-5 text-gray-600">{{ $invoice->clientEmail }}
                                    <br />{{ $client ? $client->address1 : ""}}</div>
                                    <!--end::Description-->
                                </div>
                                <!--end::Col-->
                                <!--end::Col-->
                                <div class="col-sm-6">
                                    <!--end::Label-->
                                    <div class="fw-bold fs-5 text-gray-600 mb-1">Issued By:</div>
                                    <!--end::Label-->
                                    <!--end::Text-->
                                    <div class="fw-bolder fs-4 text-gray-800">
                                    @auth
                                        {{ auth()->user()->name }}
                                    @endauth
                                    </div>
                                    <!--end::Text-->
                                    <!--end::Description-->
                                    <div class="fw-bold fs-5 text-gray-600">
                                    @auth
                                        {{ auth()->user()->email }}
                                    @endauth
                                    <br />
                                    @auth
                                        {{ auth()->user()->companyAddress1 }}
                                    @endauth
                                    </div>
                                    <!--end::Description-->
                                </div>
                                <!--end::Col-->
                            </div>
                            <!--end::Row-->
                            <!--begin::Content-->
                            <div class="flex-grow-1">
                                <!--begin::Table-->
                                <div class="table-responsive">
                                    <table class="table align-middle table-row-dashed fs-4 fw-bold gy-4" id="kt_subscription_products_table">
                                        <!--begin::Table head-->
                                        <thead>
                                            <tr class="text-start fw-bolder fs-5 text-uppercase gs-0">
                                                <th class="min-w-300px">Product</th>
                                                <th class="min-w-50px">Qty</th>
                                                <th class="min-w-100px text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <!--end::Table head-->
                                        <!--begin::Table body-->
                                        <tbody class="text-gray-800">
                                            @foreach(json_decode($invoice->items) as $product)
                                            <tr>
                                                <td>{{ $product->name }}</td>
                                                <td>{{ $product->quantity }}</td>
                                                <td class="text-end">{{ $product->total }}</td>
                                            </tr>
                                            @endforeach
                                        </tbody>
                                        <!--end::Table body-->
                                    </table>
                                </div>
                                <hr/>
                                <!--begin::Container-->
                                <div class="d-flex justify-content-end mt-10">
                                    <div class="mw-300px">
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3" style="border-bottom: 2px solid black">
                                            <!--begin::Accountname-->
                                            <div class="fw-bold pe-10 fs-5">Subtotal:</div>
                                            <!--end::Accountname-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ {{ $invoice->subtotal }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <div class="d-flex flex-stack mb-3" style="border-bottom: 2px solid black">
                                            <!--begin::Accountname-->
                                            <div class="fw-bold pe-10 fs-5">Discount:</div>
                                            <!--end::Accountname-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ {{ $invoice->discount }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3">
                                            <!--begin::Accountname-->
                                            <div class="fw-bold pe-10 text-gray-600 fs-5">VAT 0%</div>
                                            <!--end::Accountname-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">{{ $invoice->tax }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3">
                                            <!--begin::Accountnumber-->
                                            <div class="fw-bold pe-10 text-gray-600 fs-5">Subtotal + VAT</div>
                                            <!--end::Accountnumber-->
                                            <!--begin::Number-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ </div>
                                            <!--end::Number-->
                                        </div>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3" style="border-bottom: 2px solid black">
                                            <!--begin::Code-->
                                            <div class="fw-bold pe-10 fs-5">Total</div>
                                            <!--end::Code-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ {{ $invoice->total }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <div class="d-flex flex-stack">
                                            <!--begin::Code-->
                                            <div class="fw-bold pe-10 fs-5">Deposit Due</div>
                                            <!--end::Code-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ {{ $invoice->deposit }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <!--end::Item-->
                                    </div>
                                </div>
                                <div class="row mt-20">
                                    <div class="col-6"></div>
                                    <div class="col-6">
                                        <div class="d-flex flex-stack mb-3">
                                            <!--begin::Accountname-->
                                            <div class="fw-bold pe-10 fs-4">Payment Schedule</div>
                                            <!--end::Accountname-->
                                        </div>
                                        <hr/>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3">
                                            <!--begin::Accountname-->
                                            <div class="fw-bold pe-10 text-gray-600 fs-5">Deposit</div>
                                            <!--end::Accountname-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">{{ $invoice->tax }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack mb-3">
                                            <!--begin::Accountnumber-->
                                            <div class="fw-bold pe-10 text-gray-600 fs-5">1st</div>
                                            <!--end::Accountnumber-->
                                            <!--begin::Number-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ </div>
                                            <!--end::Number-->
                                        </div>
                                        <!--end::Item-->
                                        <!--begin::Item-->
                                        <div class="d-flex flex-stack">
                                            <!--begin::Code-->
                                            <div class="fw-bold pe-10 text-gray-600 fs-5">2nd</div>
                                            <!--end::Code-->
                                            <!--begin::Label-->
                                            <div class="text-end fw-bolder fs-4 text-gray-800">$ {{ $invoice->total }}</div>
                                            <!--end::Label-->
                                        </div>
                                        <!--end::Item-->
                                    </div>
                                </div>
                                <div class="row mt-15 fs-4">
                                    <p>By signing this document, the customer agrees to the services and conditions outlined in this document.</p>
                                </div>
                                <div class="row mt-20 fs-4">
                                    <div class="col m-3 text-center">
                                        @if(json_decode($invoice->signature)->my)
                                        <hr/>
                                        <p>@auth{{ auth()->user()->name }}@endauth</p>
                                        @endif
                                    </div>
                                    <div class="col m-3 text-center">
                                        @if(json_decode($invoice->signature)->client)
                                        <hr/>
                                        <p>{{$invoice->clientName}}</p>
                                        @endif
                                    </div>
                                </div>
                                <!--end::Container-->
                            </div>
                            <!--end::Content-->
                        </div>
                        <!--end::Wrapper-->
                    </div>
                    <!--end::Invoice 2 content-->
                </div>
                <!--end::Content-->
                <!--begin::Sidebar-->
                <div class="m-0">
                    <!--begin::Invoice 2 sidebar-->
                    <div class="d-print-none border border-dashed border-gray-300 card-rounded h-lg-100 min-w-md-350px p-9 bg-lighten">
                        <!--begin::Labels-->
                        <div class="mb-8">
                            <span class="badge badge-light-success me-1">Approved</span>
                            <span class="badge badge-light-warning me-1">Pending Payment</span>
                            <a class="btn btn-primary fw-bolder" id="send_email" data-bs-toggle="modal" data-bs-target="#kt_send_email_modal">Email</a>
                        </div>
                        <!--end::Labels-->
                        <!--begin::Title-->
                        <h6 class="mb-8 fw-boldest text-gray-600 text-hover-primary">PAYMENT DETAILS</h6>
                        <!--end::Title-->
                        <!--begin::Item-->
                        <div class="mb-6">
                            <div class="fw-bold text-gray-600 fs-5">Paypal:</div>
                            <div class="fw-bolder text-gray-800 fs-4">codelabpay@codelab.co</div>
                        </div>
                        <!--end::Item-->
                        <!--begin::Item-->
                        <div class="mb-6">
                            <div class="fw-bold text-gray-600 fs-5">Account:</div>
                            <div class="fw-bolder text-gray-800 fs-4">Nl24IBAN34553477847370033
                            <br />AMB NLANBZTC</div>
                        </div>
                        <!--end::Item-->
                        <!--begin::Item-->
                        <div class="mb-15">
                            <div class="fw-bold text-gray-600 fs-5">Payment Term:</div>
                            <div class="fw-bolder fs-4 text-gray-800 d-flex align-items-center">14 days
                            <span class="fs-5 text-danger d-flex align-items-center">
                            <span class="bullet bullet-dot bg-danger mx-2"></span>Due in 7 days</span></div>
                        </div>
                        <!--end::Item-->
                        <!--begin::Title-->
                        <h6 class="mb-8 fw-boldest text-gray-600 text-hover-primary">PROJECT OVERVIEW</h6>
                        <!--end::Title-->
                        <!--begin::Item-->
                        <div class="mb-6">
                            <div class="fw-bold text-gray-600 fs-5">Project Name</div>
                            <div class="fw-bolder fs-4 text-gray-800">SaaS App Quickstarter
                            <a href="#" class="link-primary ps-1">View Project</a></div>
                        </div>
                        <!--end::Item-->
                        <!--begin::Item-->
                        <div class="mb-6">
                            <div class="fw-bold text-gray-600 fs-5">Completed By:</div>
                            <div class="fw-bolder text-gray-800 fs-4">Mr. Dewonte Paul</div>
                        </div>
                        <!--end::Item-->
                        <!--begin::Item-->
                        <div class="m-0">
                            <div class="fw-bold text-gray-600 fs-5">Time Spent:</div>
                            <div class="fw-bolder fs-4 text-gray-800 d-flex align-items-center">230 Hours
                            <span class="fs-5 text-success d-flex align-items-center">
                            <span class="bullet bullet-dot bg-success mx-2"></span>35$/h Rate</span></div>
                        </div>
                        <!--end::Item-->
                    </div>
                    <!--end::Invoice 2 sidebar-->
                </div>
                <!--end::Sidebar-->
            </div>
            <!--end::Layout-->
        </div>
        <!--end::Body-->
    </div>
    <div class="modal fade" id="kt_send_email_modal" tabindex="-1" aria-hidden="true">
        <!--begin::Modal dialog-->
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <!--begin::Modal content-->
            <div class="modal-content">
                <!--begin::Modal header-->
                <div class="modal-header">
                    <!--begin::Modal title-->
                    <h2 class="fw-bolder">Send Estimate</h2>
                    <!--end::Modal title-->
                    <!--begin::Close-->
                    <div id="kt_send_email_close" class="btn btn-icon btn-sm btn-active-icon-primary">
                        <!--begin::Svg Icon | path: icons/duotune/arrows/arr061.svg-->
                        <span class="svg-icon svg-icon-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="black" />
                                <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black" />
                            </svg>
                        </span>
                        <!--end::Svg Icon-->
                    </div>
                    <!--end::Close-->
                </div>
                <!--end::Modal header-->
                <!--begin::Modal body-->
                <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
                    <!--begin::Form-->
                    <form id="kt_send_email_form" class="form" action="#">
                        @csrf
                        <!--begin::Input group-->
                        <div class="fv-row mb-10">
                            <!--begin::Label-->
                            <label class="fs-5 fw-bold form-label mb-5">To:</label>
                            <!--end::Label-->
                            <!--begin::Input-->
                            <input class="form-control form-control-solid" placeholder="write client email" name="email" />
                            <!--end::Input-->
                        </div>
                        <!--end::Input group-->
                        <!--begin::Input group-->
                        <div class="fv-row mb-10">
                            <!--begin::Label-->
                            <label class="fs-5 fw-bold form-label mb-5">Subject:</label>
                            <!--end::Label-->
                            <input class="form-control form-control-solid" name="subject" />
                        </div>
                        
                        <div class="text-center">
                            <button type="reset" id="kt_send_email_cancel" class="btn btn-light me-3">Discard</button>
                            <button type="submit" id="kt_send_email_submit" class="btn btn-primary">
                                <span class="indicator-label">Submit</span>
                                <span class="indicator-progress">Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                            </button>
                        </div>
                        <!--end::Actions-->
                    </form>
                    <!--end::Form-->
                </div>
                <!--end::Modal body-->
            </div>
            <!--end::Modal content-->
        </div>
        <!--end::Modal dialog-->
    </div>
    <!--end::Invoice 2 main-->
</div>
@endsection

@section("custom_js")
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js"></script>

<script src="assets/js/my/estimate/show.js"></script>
<script src="assets/js/custom/apps/subscriptions/sendEmail.js"></script>
@endsection
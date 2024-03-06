<?php

namespace App\Http\Controllers;

use App\Mail\LinkMail;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Item;
use App\Models\Tax;
use App\Models\Invoice;
use App\Models\Client;
use App\Models\UserRole;

class EstimateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('estimate.index');
    }

    public function allEstimates()
    {
        // $estimates = Invoice::where('state', '<', 4)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->estimatePermission / 16)) {
            $estimates = Invoice::where('state', '<', 4)->get();
        } else {
            $estimates = Invoice::where('state', '<', 4)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "All", 'parent' => 0, 'permission' => $roleInfo->estimatePermission]);
    }

    public function allInvoices()
    {
        // $estimates = Invoice::where('state', '>', 3)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->invoicePermission / 16)) {
            $estimates = Invoice::where('state', '>', 3)->get();
        } else {
            $estimates = Invoice::where('state', '>', 3)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "All", 'parent' => 1, 'permission' => $roleInfo->invoicePermission]);
    }

    public function pending()
    {
        // $estimates = Invoice::where('state', 1)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->estimatePermission / 16)) {
            $estimates = Invoice::where('state', 1)->get();
        } else {
            $estimates = Invoice::where('state', 1)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "Pending", 'parent' => 0, 'permission' => $roleInfo->estimatePermission]);
    }

    public function approved()
    {
        // $estimates = Invoice::where('state', 2)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->estimatePermission / 16)) {
            $estimates = Invoice::where('state', 2)->get();
        } else {
            $estimates = Invoice::where('state', 2)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "Approved", 'parent' => 0, 'permission' => $roleInfo->estimatePermission]);
    }

    public function declined()
    {
        // $estimates = Invoice::where('state', 3)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->estimatePermission / 16)) {
            $estimates = Invoice::where('state', 3)->get();
        } else {
            $estimates = Invoice::where('state', 3)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "Declined", 'parent' => 0, 'permission' => $roleInfo->estimatePermission]);
    }

    public function active()
    {
        // $estimates = Invoice::where('state', 4)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->invoicePermission / 16)) {
            $estimates = Invoice::where('state', 4)->get();
        } else {
            $estimates = Invoice::where('state', 4)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "Active", 'parent' => 1, 'permission' => $roleInfo->invoicePermission]);
    }

    public function paid()
    {
        // $estimates = Invoice::where('state', 5)->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->invoicePermission / 16)) {
            $estimates = Invoice::where('state', 5)->get();
        } else {
            $estimates = Invoice::where('state', 5)->where('user', Auth::id())->get();
        }

        return view('estimate.list', ['estimates' => $estimates, "type" => "Paid", 'parent' => 1, 'permission' => $roleInfo->invoicePermission]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // dd($request->page);
        $status = $request->page == "Estimate" ? 1 : 4;
        $items = Item::all();
        $taxes = Tax::all();
        return view('estimate.create', ['items' => $items, 'state' => $status, 'taxes' => $taxes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $invoice = new Invoice;
        $invoice->no = $request->no;
        $invoice->clientName = $request->clientName;
        $invoice->clientEmail = $request->clientEmail;
        $invoice->dueTo = $request->date;
        $invoice->phone = $request->phone;
        $invoice->items = $request->items;
        $invoice->subtotal = $request->subtotal;
        $invoice->markup = $request->markup;
        $invoice->tax = $request->tax;
        $invoice->discount = $request->discount;
        $invoice->deposit = $request->deposit;
        $invoice->paymentSchedule = $request->paymentSchedule;
        $invoice->total = $request->total;
        $invoice->signature = $request->signature;
        $invoice->description = $request->description;
        $invoice->homeownerFinance = $request->homeownerFinance;
        $invoice->state = $request->state;

        $invoice->user = Auth::id();

        if ($request->no == null || $request->no == "") {
            return response()->json([
                'success' => false,
                'message' => "no is not exist"
            ]);
        }

        if(Invoice::where('no', $request->no)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same no exists"
            ]);
        }

        if ($invoice->save()) {
            return response()->json([
                'success' => true,
                'message' => "Data saved successfully"
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Data save failed"
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $invoice = Invoice::find($id);
        if ($invoice) {
            $client = Client::where('email', $invoice->clientEmail)->first();
            return view('estimate.show', ["invoice" => $invoice, 'client' => $client]);
        }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $invoice = Invoice::find($id);
        $items = Item::all();
        return view('estimate.edit', ["invoice" => $invoice, 'items' => $items]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function status(Request $request)
    {
        $invoice = Invoice::find($request->id);

        if ($invoice) {
            $invoice->state = $request->state;

            if ($invoice->save()) {
                return response()->json([
                    'success' => true,
                    'message' => "Data saved successfully"
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "Data save failed"
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => "estimate    not exist"
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        $invoice = Invoice::find($id);

        if ($invoice) {
            $invoice->no = $request->no;
            $invoice->clientName = $request->clientName;
            $invoice->clientEmail = $request->clientEmail;
            $invoice->dueTo = $request->date;
            $invoice->phone = $request->phone;
            $invoice->items = $request->items;
            $invoice->subtotal = $request->subtotal;
            $invoice->markup = $request->markup;
            $invoice->tax = $request->tax;
            $invoice->discount = $request->discount;
            $invoice->deposit = $request->deposit;
            $invoice->paymentSchedule = $request->paymentSchedule;
            $invoice->total = $request->total;
            $invoice->signature = $request->signature;
            $invoice->description = $request->description;
            $invoice->homeownerFinance = $request->homeownerFinance;
            $invoice->state = $request->state;

            if ($invoice->save()) {
                return response()->json([
                    'success' => true,
                    'message' => "Data saved successfully"
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => "Data save failed"
                ]);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => "estimate    not exist"
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Invoice::find($id);

        if ($item) {
            $item->delete();
            return response()->json([
                'success' => true,
                'message' => "Data deleted successfully"
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Data delete failed"
            ]);
        }
    }

    public function sendEmail(Request $request)
    {
        $subject = $request->subject;
        $message = "Your Message Here";
        $link = "https://example.com";

        Mail::to($request->email)->send(new LinkMail($subject, $message, $link));

        return response()->json(['status' => 'Email sent successfully']);
    }
}

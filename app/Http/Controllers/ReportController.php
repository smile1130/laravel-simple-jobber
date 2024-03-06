<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Invoice;
use App\Models\Client;
use App\Models\Item;

class ReportController extends Controller
{
    public function overview()
    {

        $monthQuery = Invoice::where('user', Auth::id())->whereMonth('created_at', '=', now()->month)->whereYear('created_at', '=', now()->year);
        $estimateMonth = $monthQuery->where('state', '<', 4)->get()->count();
        $pendingMonth = $monthQuery->where('state', '=', 1)->get()->count();
        $approvedMonth = $monthQuery->where('state', '=', 2)->get()->count();
        $declinedMonth = $monthQuery->where('state', '=', 3)->get()->count();

        $monthQuery = Invoice::where('user', Auth::id())->whereMonth('created_at', '=', now()->month)->whereYear('created_at', '=', now()->year);
        $invoiceMonth = $monthQuery->where('state', '>', 3)->get()->count();
        $activeMonth = $monthQuery->where('state', '=', 4)->get()->count();
        $paidMonth = $monthQuery->where('state', '=', 5)->get()->count();

        $weekQuery = Invoice::where('user', Auth::id())->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        $estimateWeek = $weekQuery->where('state', '<', 4)->get()->count();
        $pendingWeek = $weekQuery->where('state', '=', 1)->get()->count();
        $approvedWeek = $weekQuery->where('state', '=', 2)->get()->count();
        $declinedWeek = $weekQuery->where('state', '=', 3)->get()->count();

        $weekQuery = Invoice::where('user', Auth::id())->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
        $invoiceWeek = $weekQuery->where('state', '>', 3)->get()->count();
        $activeWeek = $weekQuery->where('state', '=', 4)->get()->count();
        $paidWeek = $weekQuery->where('state', '=', 5)->get()->count();

        $dayQuery = Invoice::where('user', Auth::id())->whereDate('created_at', '=', now()->toDateString());
        $estimateDay = $dayQuery->where('state', '<', 4)->get()->count();
        $pendingDay = $dayQuery->where('state', '=', 1)->get()->count();
        $approvedDay = $dayQuery->where('state', '=', 2)->get()->count();
        $declinedDay = $dayQuery->where('state', '=', 3)->get()->count();

        $dayQuery = Invoice::where('user', Auth::id())->whereDate('created_at', '=', now()->toDateString());
        $invoiceDay = $dayQuery->where('state', '>', 3)->get()->count();
        $activeDay = $dayQuery->where('state', '=', 4)->get()->count();
        $paidDay = $dayQuery->where('state', '=', 5)->get()->count();

        $latestClients = Client::latest()->take(5)->get();
        $latestItems = Item::latest()->take(5)->get();

        $totalEstimate = Invoice::where('state', '<', 4)->where('user', Auth::id())->sum('total');
        $totalEstimateCount = Invoice::where('state', '<', 4)->where('user', Auth::id())->get()->count();
        $totalInvoice = Invoice::where('state', '>', 3)->where('user', Auth::id())->sum('total');
        $totalInvoiceCount = Invoice::where('state', '>', 3)->where('user', Auth::id())->get()->count();
        $totalClients = Client::all()->where('user', Auth::id())->count();
        $totalItems = Item::all()->where('user', Auth::id())->count();

        return view('reports.index', [
            'estimateMonth' => $estimateMonth,
            'pendingMonth' => $pendingMonth,
            'approvedMonth' => $approvedMonth,
            'declinedMonth' => $declinedMonth,
            'invoiceMonth' => $invoiceMonth,
            'activeMonth' => $activeMonth,
            'paidMonth' => $paidMonth,
            'estimateWeek' => $estimateWeek,
            'pendingWeek' => $pendingWeek,
            'approvedWeek' => $approvedWeek,
            'declinedWeek' => $declinedWeek,
            'invoiceWeek' => $invoiceWeek,
            'activeWeek' => $activeWeek,
            'paidWeek' => $paidWeek,
            'estimateDay' => $estimateDay,
            'pendingDay' => $pendingDay,
            'approvedDay' => $approvedDay,
            'declinedDay' => $declinedDay,
            'invoiceDay' => $invoiceDay,
            'activeDay' => $activeDay,
            'paidDay' => $paidDay,
            'latestClients' => $latestClients,
            'latestItems' => $latestItems,
            'totalEstimate' => $totalEstimate,
            'totalEstimateCount' => $totalEstimateCount,
            'totalInvoice' => $totalInvoice,
            'totalInvoiceCount' => $totalInvoiceCount,
            'totalClients' => $totalClients,
            'totalItems' => $totalItems
        ]);
    }
}

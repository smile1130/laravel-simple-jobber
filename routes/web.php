<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\EstimateController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MarkupController;
use App\Http\Controllers\TaxController;

use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserRoleController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::middleware(['auth'])->group(function () {

    Route::get('/home', function () {
        return view('estimate.index');
    });

    Route::get('estimates/all', [EstimateController::class, 'allEstimates']);
    Route::get('estimates/pending', [EstimateController::class, 'pending']);
    Route::get('estimates/approved', [EstimateController::class, 'approved']);
    Route::get('estimates/declined', [EstimateController::class, 'declined']);
    Route::get('invoices/all', [EstimateController::class, 'allInvoices']);
    Route::get('invoices/active', [EstimateController::class, 'active']);
    Route::get('invoices/paid', [EstimateController::class, 'paid']);

    Route::post('/sendEmail', [EstimateController::class, 'sendEmail']);

    Route::post('estimates/status', [EstimateController::class, 'status']);

    Route::resource('estimates', EstimateController::class);

    Route::post('clients/search', [ClientController::class, 'search']);
    Route::resource('clients', ClientController::class);

    Route::resource('items', ItemController::class);

    Route::get('reports/overview', [ReportController::class, 'overview']);

    Route::get('settings', [SettingController::class, 'index']);

    Route::post('users/update', [UserController::class, 'update']);
    Route::post('users/updateEstimateMsg', [UserController::class, 'updateEstimateMsg']);
    Route::post('users/updateInvoiceMsg', [UserController::class, 'updateInvoiceMsg']);

    Route::resource('markup', MarkupController::class);
    Route::resource('tax', TaxController::class);

    Route::post('admin/setUserRole', [AdminController::class, 'setUserRole']);
    Route::resource('admin', AdminController::class);

    Route::post('userRole/updatePermission', [UserRoleController::class, 'updatePremission']);
    Route::resource('userRole', UserRoleController::class);
});

Auth::routes();

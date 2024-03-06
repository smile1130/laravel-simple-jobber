<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Markup;
use App\Models\Tax;

class SettingController extends Controller
{
    public function index()
    {
        $markups = Markup::where('user', auth()->id())->get();
        $taxes = Tax::where('user', auth()->id())->get();

        return view('settings.index', ['markups' => $markups, 'taxes' => $taxes]);
    }
}

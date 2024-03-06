<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Item;
use App\Models\Tax;
use App\Models\Markup;
use App\Models\UserRole;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $items = Item::where('user', Auth::id())->get();
        $taxes = Tax::where('user', Auth::id())->get();
        $markups = Markup::where('user', Auth::id())->get();

        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->itemPermission / 16)) {
            $items = Item::all();
        } else {
            $items = Item::where('user', Auth::id())->get();
        }
        return view('item.index', ['items' => $items, 'taxes' => $taxes, 'markups' => $markups, 'permission' => $roleInfo->itemPermission]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $item = new Item;
        $item->name = $request->name;
        $item->rate = $request->rate;
        $item->taxes = $request->taxes;
        $item->markup = $request->markup;
        $item->description = $request->description;

        $item->user = Auth::id();

        if(Item::where('name', $request->name)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same item exists"
            ]);
        }

        if ($item->save()) {
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
        //
        $item = Item::find($id);

        $taxes = Tax::where('user', Auth::id())->get();
        $markups = Markup::where('user', Auth::id())->get();

        if ($item) {
            return response()->json([
                'success' => true,
                'message' => "success ok",
                'item' => $item,
                'taxes' => $taxes,
                'markups' => $markups
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Item not exist"
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $item = Item::find($id);

        if ($item) {
            $item->name = $request->name;
            $item->rate = $request->rate;
            $item->taxes = $request->taxes;
            $item->markup = $request->markup;
            $item->description = $request->description;

            if ($item->save()) {
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
                'message' => "user not exist"
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = Item::find($id);

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
}

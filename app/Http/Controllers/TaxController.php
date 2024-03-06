<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Tax;

class TaxController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $tax = new Tax;
        $tax->name = $request->name;
        $tax->rate = $request->rate;
        $tax->user = $request->id;

        if(tax::where('name', $request->name)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same tax exists"
            ]);
        }

        if ($tax->save()) {
            return response()->json([
                'success' => true,
                'message' => "Data saved successfully",
                'id' => $tax->id
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tax = Tax::find($id);

        if ($tax) {
            $tax->delete();
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

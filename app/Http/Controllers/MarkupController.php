<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Markup;

class MarkupController extends Controller
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
        $markup = new Markup;
        $markup->name = $request->name;
        $markup->rate = $request->rate;
        $markup->user = $request->id;

        if(Markup::where('name', $request->name)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same markup exists"
            ]);
        }

        if ($markup->save()) {
            return response()->json([
                'success' => true,
                'message' => "Data saved successfully",
                'id' => $markup->id
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
        $markup = Markup::find($id);

        if ($markup) {
            $markup->delete();
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
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
        //
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
    public function update(Request $request)
    {
        $user = User::find($request->input('id'));

        if ($user) {
            $user->name = $request->input('name');
            $user->email = $request->input('email');
            $user->description = $request->input('description');
            $user->currency = $request->input('currency');
            $user->locale = $request->input('locale');
            $user->companyName = $request->input('companyName');
            $user->companyPhone = $request->input('companyPhone');
            $user->companyAddress1 = $request->input('companyAddress1');
            $user->companyAddress2 = $request->input('companyAddress2');
            $user->companyCity = $request->input('companyCity');
            $user->companyState = $request->input('companyState');
            $user->companyZip = $request->input('companyZip');
            $user->companyCountry = $request->input('companyCountry');
            $user->companyEmail = $request->input('companyEmail');
            $user->companyPhone2 = $request->input('companyPhone2');
            $user->companyFax = $request->input('companyFax');
            $user->companyWebsite = $request->input('companyWebsite');
            $user->industry = $request->input('industry');
            
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $destinationPath = 'uploads/avatars';
    
                $filename = uniqid() . '_' . $file->getClientOriginalName();
    
                // Move the file to the public directory
                $path = $file->move(public_path($destinationPath), $filename);
                $user->avatar = $filename;
            }

            if ($user->save()) {
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

    public function updateEstimateMsg(Request $request)
    {
        $user = User::find($request->id);

        if ($user) {
            $user->estimateMsg = $request->msg;
            if ($user->save()) {
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

    public function updateInvoiceMsg(Request $request)
    {
        $user = User::find($request->id);

        if ($user) {
            $user->invoiceMsg = $request->msg;
            if ($user->save()) {
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
        //
    }
}

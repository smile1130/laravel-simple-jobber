<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\UserRole;

class UserRoleController extends Controller
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
        $userRole = new UserRole;
        $userRole->title = $request->role;

        if(UserRole::where('title', $request->role)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same Role exists"
            ]);
        }

        if ($userRole->save()) {
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
        $userRole = UserRole::find($id);

        if ($userRole) {
            return response()->json([
                'success' => true,
                'message' => "Data get success",
                'data' => json_encode($userRole)
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Data get failed"
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
        $userRole = UserRole::find($id);

        if ($userRole) {
            $userRole->title = $request->role;

            if ($userRole->save()) {
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
        $userRole = UserRole::find($id);

        if ($userRole) {
            $userRole->delete();
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

    public function updatePremission(Request $request)
    {
        $userRole = UserRole::find($request->id);

        if ($userRole) {
            $userRole->customerPermission = $request->customerPermission;
            $userRole->itemPermission = $request->itemPermission;
            $userRole->estimatePermission = $request->estimatePermission;
            $userRole->invoicePermission = $request->invoicePermission;
            $userRole->userPermission = $request->userPermission;

            if ($userRole->save()) {
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
                'message' => "user role not exist"
            ]);
        }
    }
}

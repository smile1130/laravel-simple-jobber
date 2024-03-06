<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Client;
use App\Models\UserRole;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roleInfo = UserRole::where('title', Auth::user()->role)->first();
        if (floor($roleInfo->customerPermission / 16)) {
            $clients = Client::all();
        } else {
            $clients = Client::where('user', Auth::id())->get();
        }
        return view('client.index', ['clients' => $clients, 'permission' => $roleInfo->customerPermission]);
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
        $client = new Client;
        $client->name = $request->name;
        $client->email = $request->email;
        $client->phone = $request->phone;
        $client->phone2 = $request->phone2;
        $client->address1 = $request->address1;
        $client->address2 = $request->address2;
        $client->city = $request->city;
        $client->state = $request->state;
        $client->zip = $request->zip;
        $client->description = $request->description;

        $client->user = Auth::id();

        if(Client::where('email', $request->email)->first()) {
            return response()->json([
                'success' => false,
                'message' => "Same email exists"
            ]);
        }

        if ($client->save()) {
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
        $client = Client::find($id);

        if ($client) {
            return response()->json([
                'success' => true,
                'message' => "success ok",
                'client' => $client
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "user not exist"
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
        $client = Client::find($id);

        if ($client) {
            $client->name = $request->name;
            $client->email = $request->email;
            $client->phone = $request->phone;
            $client->phone2 = $request->phone2;
            $client->address1 = $request->address1;
            $client->address2 = $request->address2;
            $client->city = $request->city;
            $client->state = $request->state;
            $client->zip = $request->zip;
            $client->description = $request->description;

            if ($client->save()) {
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
        $item = Client::find($id);

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

    public function search(Request $request)
    {
        $searchString = $request->searchString;
        $clients = Client::where('name', 'like', $searchString)
                        ->orWhere('email', 'like', $searchString)
                        ->get();

        if ($clients) {
            return response()->json([
                'success' => true,
                'message' => "success ok",
                'clients' => $clients
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "user not exist"
            ]);
        }
    }
}

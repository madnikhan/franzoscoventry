<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    public function index()
    {
        return view('track.index');
    }

    public function lookup(Request $request)
    {
        $request->validate(['order_number' => 'required|string']);

        return redirect()->route('track.show', strtoupper($request->string('order_number')));
    }

    public function show(string $orderNumber)
    {
        $order = Order::query()
            ->where('order_number', strtoupper($orderNumber))
            ->with('items')
            ->firstOrFail();

        return view('track.show', compact('order'));
    }
}

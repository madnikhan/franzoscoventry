<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Support\Domain;
use Illuminate\Http\Request;

class KitchenController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index()
    {
        $active = Order::query()
            ->with('items')
            ->whereIn('status', ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'])
            ->orderByDesc('created_at')
            ->get();

        return view('kitchen.index', ['orders' => $active, 'statuses' => Domain::ORDER_STATUSES]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:'.implode(',', Domain::ORDER_STATUSES),
        ]);

        $order = Order::findOrFail($id);
        $this->orders->updateStatus($order, $validated['status']);

        if ($request->wantsJson()) {
            return response()->json(['order' => $order->fresh('items')]);
        }

        return back()->with('status', 'Order '.$order->order_number.' updated.');
    }
}

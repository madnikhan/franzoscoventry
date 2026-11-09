<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use App\Support\Domain;
use Illuminate\Http\Request;

class OrderApiController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index(Request $request)
    {
        $query = Order::query()->with('items')->orderByDesc('created_at');
        if ($status = $request->query('status')) {
            $query->whereIn('status', explode(',', $status));
        }
        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }

        return response()->json(['orders' => $query->get()]);
    }

    public function track(string $orderNumber)
    {
        $order = Order::query()
            ->where('order_number', strtoupper($orderNumber))
            ->with('items')
            ->first();

        if (! $order) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json(['order' => $order]);
    }

    public function updateStatus(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:'.implode(',', Domain::ORDER_STATUSES),
            'driverId' => 'nullable|integer',
        ]);

        $order = Order::findOrFail($id);
        $driverId = $validated['driverId'] ?? null;
        $order = $this->orders->updateStatus($order, $validated['status'], $driverId);

        return response()->json(['order' => $order]);
    }

    public function stats()
    {
        return response()->json($this->orders->stats());
    }
}

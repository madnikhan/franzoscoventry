<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
class TillController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index()
    {
        $items = MenuItem::query()->where('is_available', true)->orderBy('name')->limit(40)->get();
        $recent = Order::query()->where('type', 'TAKEAWAY')->orderByDesc('created_at')->limit(10)->get();

        return view('till.index', compact('items', 'recent'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'customer_name' => 'nullable|string|max:120',
        ]);

        $item = MenuItem::findOrFail($validated['menu_item_id']);
        $lines = [[
            'itemId' => $item->external_id,
            'name' => $item->name,
            'unitPrice' => (float) $item->price,
            'quantity' => 1,
            'customizations' => [],
        ]];

        $this->orders->place([
            'type' => 'TAKEAWAY',
            'payment_method' => 'cash',
            'customer_name' => $validated['customer_name'] ?? 'Till Guest',
            'customer_phone' => '0000000000',
        ], $lines);

        return back()->with('status', 'Till order created.');
    }
}

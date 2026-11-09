<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Services\CartService;
use App\Services\OrderService;
use App\Support\Domain;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private CartService $cart,
        private OrderService $orders,
    ) {}

    public function checkout()
    {
        $lines = $this->cart->lines();
        $type = session('franzos.order_type', 'COLLECTION');
        $totals = $this->orders->computeTotals($type, $lines);

        return view('order.checkout', [
            'lines' => $lines,
            'type' => $type,
            'totals' => $totals,
            'orderTypes' => Domain::ORDER_TYPES,
        ]);
    }

    public function updateCart(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:update,remove,clear',
            'item_id' => 'nullable|string',
            'quantity' => 'nullable|integer|min:0|max:20',
            'spice' => 'nullable|string',
        ]);

        $customizations = array_filter(['spice' => $validated['spice'] ?? null]);

        match ($validated['action']) {
            'clear' => $this->cart->clear(),
            'remove' => $this->cart->remove($validated['item_id'] ?? '', $customizations),
            'update' => $this->cart->updateQuantity(
                $validated['item_id'] ?? '',
                (int) ($validated['quantity'] ?? 1),
                $customizations
            ),
        };

        return back();
    }

    public function store(Request $request)
    {
        $lines = $this->cart->lines();
        if ($lines === []) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        $validated = $request->validate([
            'type' => 'required|in:'.implode(',', Domain::ORDER_TYPES),
            'payment_method' => 'required|in:card,cash,sumup',
            'customer_name' => 'required|string|max:120',
            'customer_phone' => 'required|string|max:40',
            'customer_email' => 'nullable|email',
            'address' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validated['type'] === 'DELIVERY' && empty($validated['address'])) {
            return back()->withErrors(['address' => 'Delivery address required.'])->withInput();
        }

        session(['franzos.order_type' => $validated['type']]);

        $order = $this->orders->place($validated, $lines);
        $this->cart->clear();

        return redirect()
            ->route('track.show', $order->order_number)
            ->with('status', 'Order placed successfully.');
    }

    public function quickAdd(Request $request)
    {
        $validated = $request->validate(['menu_item_id' => 'required|exists:menu_items,id']);
        $item = MenuItem::findOrFail($validated['menu_item_id']);
        $this->cart->add($item->external_id, $item->name, (float) $item->price);

        return back()->with('status', $item->name.' added.');
    }
}

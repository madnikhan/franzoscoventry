<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CartService;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function __construct(private CartService $cart) {}

    public function index()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->with(['menuItems' => fn ($q) => $q->where('is_available', true)->orderBy('name')])
            ->get();

        return view('menu.index', [
            'categories' => $categories,
            'cartCount' => $this->cart->count(),
        ]);
    }

    public function addToCart(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|string',
            'name' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'nullable|integer|min:1|max:20',
            'spice' => 'nullable|string',
        ]);

        $customizations = array_filter([
            'spice' => $validated['spice'] ?? null,
        ]);

        $this->cart->add(
            $validated['item_id'],
            $validated['name'],
            (float) $validated['price'],
            (int) ($validated['quantity'] ?? 1),
            $customizations
        );

        return redirect()->route('order.checkout')->with('status', 'Added to cart.');
    }
}

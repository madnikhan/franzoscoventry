<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;

class AdminController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index()
    {
        $stats = $this->orders->stats();
        $recent = Order::query()->with('items')->orderByDesc('created_at')->limit(15)->get();

        return view('admin.index', compact('stats', 'recent'));
    }
}

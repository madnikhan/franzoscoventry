<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class KitchenApiController extends Controller
{
    public function orders(Request $request)
    {
        $query = Order::query()->with('items')->orderByDesc('created_at');
        if ($status = $request->query('status')) {
            $query->whereIn('status', explode(',', $status));
        }

        return response()->json(['orders' => $query->get()]);
    }
}

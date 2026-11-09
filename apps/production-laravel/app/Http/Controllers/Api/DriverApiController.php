<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DriverApiController extends Controller
{
    public function login(Request $request)
    {
        $phone = (string) $request->input('phone', '');
        $password = (string) $request->input('password', '');
        $normalized = preg_replace('/\s+/', '', $phone);

        $driver = Driver::all()->first(fn (Driver $d) => preg_replace('/\s+/', '', $d->phone) === $normalized
            && Hash::check($password, $d->password));

        if (! $driver) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'driver' => [
                'id' => $driver->external_id,
                'name' => $driver->name,
                'phone' => $driver->phone,
            ],
        ]);
    }

    public function deliveries()
    {
        $orders = Order::query()
            ->where('type', 'DELIVERY')
            ->whereIn('status', ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'])
            ->with('items')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['orders' => $orders]);
    }
}

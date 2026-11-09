<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DriverController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function loginForm()
    {
        return view('driver.login');
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $normalized = preg_replace('/\s+/', '', $validated['phone']);
        $driver = Driver::all()->first(function (Driver $d) use ($normalized, $validated) {
            return preg_replace('/\s+/', '', $d->phone) === $normalized
                && Hash::check($validated['password'], $d->password);
        });

        if (! $driver) {
            return back()->withErrors(['phone' => 'Invalid credentials.']);
        }

        session(['franzos.driver_id' => $driver->id]);

        return redirect()->route('driver.board');
    }

    public function board()
    {
        $driverId = session('franzos.driver_id');
        if (! $driverId) {
            return redirect()->route('driver.login');
        }

        $driver = Driver::findOrFail($driverId);
        $deliveries = Order::query()
            ->where('type', 'DELIVERY')
            ->whereIn('status', ['READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'])
            ->orderByDesc('updated_at')
            ->with('items')
            ->get();

        return view('driver.board', compact('driver', 'deliveries'));
    }

    public function assign(Request $request, string $id)
    {
        $driverId = session('franzos.driver_id');
        if (! $driverId) {
            return redirect()->route('driver.login');
        }

        $order = Order::findOrFail($id);
        $this->orders->updateStatus($order, 'OUT_FOR_DELIVERY', (int) $driverId);

        return back();
    }
}

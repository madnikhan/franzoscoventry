<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FranzosDemoSeeder extends Seeder
{
    public function run(): void
    {
        Driver::updateOrCreate(
            ['external_id' => 'drv-1'],
            [
                'name' => 'Alex Driver',
                'phone' => '+447700900001',
                'password' => 'driver123',
                'is_available' => true,
            ]
        );
        Driver::updateOrCreate(
            ['external_id' => 'drv-2'],
            [
                'name' => 'Sam Courier',
                'phone' => '+447700900002',
                'password' => 'driver123',
                'is_available' => true,
            ]
        );

        if (Order::query()->exists()) {
            return;
        }

        $prefix = config('franzos.orderPrefix', 'FZ');

        $order1 = Order::create([
            'order_number' => $prefix.'1001',
            'type' => 'DELIVERY',
            'status' => 'PREPARING',
            'payment_status' => 'COMPLETED',
            'payment_method' => 'card',
            'customer_name' => 'Demo Customer',
            'customer_phone' => '+447700900099',
            'address' => '1 Broadgate, Coventry CV1 1NH',
            'subtotal' => 18.40,
            'delivery_fee' => 2.50,
            'vat' => 4.18,
            'total' => 25.08,
        ]);
        OrderItem::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order1->id,
            'name' => 'Half Grilled Chicken',
            'quantity' => 1,
            'unit_price' => 8.95,
            'customizations' => ['spice' => 'medium'],
        ]);
        Payment::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order1->id,
            'method' => 'card',
            'amount' => 25.08,
            'status' => 'COMPLETED',
        ]);

        $order2 = Order::create([
            'order_number' => $prefix.'1002',
            'type' => 'COLLECTION',
            'status' => 'PENDING',
            'payment_status' => 'COMPLETED',
            'payment_method' => 'cash',
            'customer_name' => 'Walk-in Guest',
            'customer_phone' => '+447700900088',
            'subtotal' => 7.90,
            'delivery_fee' => 0,
            'vat' => 1.58,
            'total' => 9.48,
        ]);
        OrderItem::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order2->id,
            'name' => 'Piri Piri Chicken Burger',
            'quantity' => 1,
            'unit_price' => 7.90,
            'customizations' => ['spice' => 'hot'],
        ]);
        Payment::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order2->id,
            'method' => 'cash',
            'amount' => 9.48,
            'status' => 'COMPLETED',
        ]);
    }
}

<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private SumUpService $sumUp,
    ) {}

    /** @param list<array{itemId: string, name: string, unitPrice: float, quantity: int, customizations: array<string, string>}> $lines */
    public function computeTotals(string $type, array $lines): array
    {
        $subtotal = array_reduce($lines, fn (float $s, array $l) => $s + ($l['unitPrice'] * $l['quantity']), 0.0);
        $delivery = config('franzos.delivery');
        $deliveryFee = $type === 'DELIVERY' && ($delivery['enabled'] ?? false)
            ? (float) ($delivery['fee'] ?? 0)
            : 0.0;
        $vatRate = (float) (config('franzos.vatRate') ?? 0);
        $vat = round(($subtotal + $deliveryFee) * $vatRate, 2);
        $total = round($subtotal + $deliveryFee + $vat, 2);

        return compact('subtotal', 'deliveryFee', 'vat', 'total');
    }

    public function nextOrderNumber(): string
    {
        $prefix = config('franzos.orderPrefix', 'FZ');
        $last = Order::query()
            ->where('order_number', 'like', $prefix.'%')
            ->orderByDesc('order_number')
            ->value('order_number');

        $seq = 1001;
        if ($last) {
            $num = (int) preg_replace('/\D/', '', $last);
            if ($num >= $seq) {
                $seq = $num + 1;
            }
        }

        return $prefix.$seq;
    }

    /** @param list<array{itemId: string, name: string, unitPrice: float, quantity: int, customizations: array<string, string>}> $lines */
    public function place(array $payload, array $lines): Order
    {
        $type = $payload['type'];
        $totals = $this->computeTotals($type, $lines);
        $useCard = in_array($payload['payment_method'], ['card', 'sumup'], true);
        $paymentStatus = $useCard ? 'PENDING' : 'COMPLETED';

        return DB::transaction(function () use ($payload, $lines, $totals, $paymentStatus, $useCard) {
            $order = Order::create([
                'order_number' => $this->nextOrderNumber(),
                'type' => $payload['type'],
                'status' => 'PENDING',
                'payment_status' => $paymentStatus,
                'payment_method' => $payload['payment_method'],
                'customer_name' => $payload['customer_name'],
                'customer_phone' => $payload['customer_phone'],
                'customer_email' => $payload['customer_email'] ?? null,
                'address' => $payload['address'] ?? null,
                'notes' => $payload['notes'] ?? null,
                ...$totals,
            ]);

            foreach ($lines as $line) {
                OrderItem::create([
                    'id' => (string) Str::uuid(),
                    'order_id' => $order->id,
                    'menu_item_external_id' => $line['itemId'],
                    'name' => $line['name'],
                    'quantity' => $line['quantity'],
                    'unit_price' => $line['unitPrice'],
                    'customizations' => $line['customizations'] ?: null,
                ]);
            }

            $payment = Payment::create([
                'id' => (string) Str::uuid(),
                'order_id' => $order->id,
                'provider' => 'sumup',
                'method' => $payload['payment_method'],
                'amount' => $order->total,
                'status' => $paymentStatus,
            ]);

            if ($useCard) {
                $checkout = $this->sumUp->createCheckout(
                    (float) $order->total,
                    $order->id,
                    'Franzos '.$order->order_number
                );
                $payment->update([
                    'external_id' => $checkout['checkoutId'],
                    'status' => $checkout['status'],
                    'payload' => $checkout,
                ]);
                $order->update(['payment_status' => $checkout['status']]);
            } else {
                $payment->update(['status' => 'COMPLETED']);
            }

            return $order->load('items', 'payment');
        });
    }

    public function updateStatus(Order $order, string $status, ?int $driverId = null): Order
    {
        $flow = json_decode(
            (string) file_get_contents(database_path('data/domain.json')),
            true
        )['statusFlow'] ?? [];

        $allowed = $flow[$order->status] ?? [];
        if (! in_array($status, $allowed, true) && $order->status !== $status) {
            throw new \InvalidArgumentException("Invalid status transition from {$order->status} to {$status}");
        }

        $order->status = $status;
        if ($driverId) {
            $order->driver_id = $driverId;
        }
        if ($status === 'OUT_FOR_DELIVERY' && $driverId) {
            $order->driver_id = $driverId;
        }
        $order->save();

        return $order->fresh('items', 'driver');
    }

    /** @return array{totalOrders: int, todayOrders: int, revenue: float, active: int} */
    public function stats(): array
    {
        $orders = Order::query()->with('items')->get();
        $today = now()->toDateString();
        $activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'];

        return [
            'totalOrders' => $orders->count(),
            'todayOrders' => $orders->filter(fn (Order $o) => $o->created_at?->toDateString() === $today)->count(),
            'revenue' => round(
                $orders->where('payment_status', 'COMPLETED')->where('status', '!=', 'CANCELLED')->sum('total'),
                2
            ),
            'active' => $orders->whereIn('status', $activeStatuses)->count(),
        ];
    }
}

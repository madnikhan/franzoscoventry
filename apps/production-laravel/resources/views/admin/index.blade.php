@extends('layouts.franzos')

@section('title', 'Admin')

@section('content')
<div class="mx-auto max-w-5xl px-4 py-10">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Dashboard</h1>
    <div class="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        @foreach ([['Total orders', $stats['totalOrders']], ['Today', $stats['todayOrders']], ['Revenue', '£'.number_format($stats['revenue'], 2)], ['Active', $stats['active']]] as [$label, $value])
            <div class="rounded-xl bg-white border border-[var(--fz-sand)] p-4 text-center">
                <p class="text-xs uppercase text-[var(--fz-muted)]">{{ $label }}</p>
                <p class="mt-2 text-2xl font-bold">{{ $value }}</p>
            </div>
        @endforeach
    </div>
    <h2 class="mt-12 font-semibold">Recent orders</h2>
    <table class="mt-4 w-full text-sm">
        <thead><tr class="border-b"><th class="text-left py-2">#</th><th>Status</th><th class="text-right">Total</th></tr></thead>
        <tbody>
            @foreach ($recent as $order)
                <tr class="border-b border-[var(--fz-sand)]">
                    <td class="py-2"><a href="{{ route('track.show', $order->order_number) }}" class="text-[var(--fz-flame)]">{{ $order->order_number }}</a></td>
                    <td class="text-center">{{ $order->status }}</td>
                    <td class="text-right">£{{ number_format($order->total, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

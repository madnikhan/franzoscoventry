@extends('layouts.franzos')

@section('title', $order->order_number)

@section('content')
<div class="mx-auto max-w-lg px-4 py-12">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">{{ $order->order_number }}</h1>
    <p class="mt-2 text-lg font-semibold">{{ str_replace('_', ' ', $order->status) }}</p>
    <p class="text-sm text-[var(--fz-muted)]">Payment: {{ $order->payment_status }} · {{ $order->type }}</p>
    <ul class="mt-6 space-y-2 border-t border-[var(--fz-sand)] pt-4">
        @foreach ($order->items as $item)
            <li class="flex justify-between text-sm">
                <span>{{ $item->quantity }}× {{ $item->name }}</span>
                <span>£{{ number_format($item->unit_price * $item->quantity, 2) }}</span>
            </li>
        @endforeach
    </ul>
    <p class="mt-4 text-right font-bold">Total £{{ number_format($order->total, 2) }}</p>
    <a href="{{ route('track.index') }}" class="mt-8 inline-block text-[var(--fz-flame)] underline">Track another</a>
</div>
@endsection

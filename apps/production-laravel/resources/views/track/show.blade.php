@extends('layouts.franzos')

@section('title', $order->order_number)

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
    <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">{{ $order->order_number }}</h1>
    <p class="mt-3 text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">{{ str_replace('_', ' ', $order->status) }}</p>
    <div class="fz-card mt-8 max-w-lg p-5 md:p-6">
        <p class="text-sm text-[var(--fz-muted)]">Payment: {{ $order->payment_status }} · {{ $order->type }}</p>
        <ul class="mt-6 space-y-2 border-t-[3px] border-[var(--fz-outline)]/15 pt-4">
            @foreach ($order->items as $item)
                <li class="flex min-w-0 justify-between gap-3 text-sm">
                    <span class="min-w-0 truncate">{{ $item->quantity }}× {{ $item->name }}</span>
                    <span class="shrink-0">£{{ number_format($item->unit_price * $item->quantity, 2) }}</span>
                </li>
            @endforeach
        </ul>
        <p class="mt-4 text-right text-lg font-bold">Total £{{ number_format($order->total, 2) }}</p>
    </div>
    <a href="{{ route('track.index') }}" class="mt-8 inline-block font-semibold text-[var(--fz-tomato)] underline">Track another</a>
</div>
@endsection

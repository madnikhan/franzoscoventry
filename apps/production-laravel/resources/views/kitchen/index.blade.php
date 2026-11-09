@extends('layouts.franzos')

@section('title', 'Kitchen KDS')

@section('content')
<div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Kitchen display</h1>
    <p class="text-sm text-[var(--fz-muted)]">Poll: <code>/api/kitchen/orders</code></p>
    <div class="mt-8 grid gap-4 md:grid-cols-2" x-data x-init="setInterval(() => $el.dispatchEvent(new CustomEvent('refresh-kitchen')), 15000)">
        @forelse ($orders as $order)
            <article class="rounded-xl border-2 border-[var(--fz-ember)] bg-white p-4" data-order-id="{{ $order->id }}">
                <header class="flex justify-between items-start">
                    <div>
                        <p class="font-[family-name:var(--fz-font-display)] text-2xl">{{ $order->order_number }}</p>
                        <p class="text-xs text-[var(--fz-muted)]">{{ $order->type }} · {{ $order->created_at->diffForHumans() }}</p>
                    </div>
                    <span class="rounded bg-[var(--fz-sand)] px-2 py-1 text-xs font-bold">{{ $order->status }}</span>
                </header>
                <ul class="mt-3 text-sm space-y-1">
                    @foreach ($order->items as $item)
                        <li>{{ $item->quantity }}× {{ $item->name }}</li>
                    @endforeach
                </ul>
                <form action="{{ route('kitchen.status', $order->id) }}" method="post" class="mt-4 flex flex-wrap gap-2">
                    @csrf
                    @php
                        $next = match($order->status) {
                            'PENDING' => 'CONFIRMED',
                            'CONFIRMED' => 'PREPARING',
                            'PREPARING' => 'READY_FOR_PICKUP',
                            'READY_FOR_PICKUP' => $order->type === 'DELIVERY' ? 'OUT_FOR_DELIVERY' : 'DELIVERED',
                            default => null,
                        };
                    @endphp
                    @if ($next)
                        <input type="hidden" name="status" value="{{ $next }}">
                        <button type="submit" class="rounded-lg bg-[var(--fz-leaf)] px-4 py-2 text-sm font-bold text-white">→ {{ str_replace('_', ' ', $next) }}</button>
                    @endif
                </form>
            </article>
        @empty
            <p class="text-[var(--fz-muted)]">No active tickets.</p>
        @endforelse
    </div>
</div>
@endsection

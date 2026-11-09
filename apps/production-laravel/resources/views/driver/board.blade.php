@extends('layouts.franzos')

@section('title', 'Driver board')

@section('content')
<div class="mx-auto max-w-4xl px-4 py-10">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Hi, {{ $driver->name }}</h1>
    <div class="mt-8 space-y-4">
        @foreach ($deliveries as $order)
            <article class="rounded-lg border border-[var(--fz-sand)] bg-white p-4">
                <div class="flex justify-between">
                    <span class="font-bold">{{ $order->order_number }}</span>
                    <span class="text-sm">{{ $order->status }}</span>
                </div>
                <p class="text-sm mt-1">{{ $order->address }}</p>
                @if ($order->status === 'READY_FOR_PICKUP')
                    <form action="{{ route('driver.assign', $order->id) }}" method="post" class="mt-3">
                        @csrf
                        <button class="text-sm font-semibold text-[var(--fz-flame)]">Take delivery →</button>
                    </form>
                @endif
            </article>
        @endforeach
    </div>
</div>
@endsection

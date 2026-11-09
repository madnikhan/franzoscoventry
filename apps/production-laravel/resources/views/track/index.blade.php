@extends('layouts.franzos')

@section('title', 'Track order')

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
    <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">Track your order</h1>
    <p class="mt-3 max-w-2xl text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">Enter your order number to see live status.</p>
    <form action="{{ route('track.lookup') }}" method="post" class="fz-card mt-8 max-w-lg space-y-4 p-5 md:p-6">
        @csrf
        <label class="block min-w-0">
            <span class="text-sm font-semibold">Order number</span>
            <input name="order_number" placeholder="FZ1001" class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2 uppercase" required>
        </label>
        <button type="submit" class="fz-btn w-full">Track</button>
    </form>
</div>
@endsection

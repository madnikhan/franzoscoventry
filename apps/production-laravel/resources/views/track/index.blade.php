@extends('layouts.franzos')

@section('title', 'Track order')

@section('content')
<div class="mx-auto max-w-md px-4 py-16">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Track your order</h1>
    <form action="{{ route('track.lookup') }}" method="post" class="mt-8 space-y-4">
        @csrf
        <label class="block">
            <span class="text-sm font-semibold">Order number</span>
            <input name="order_number" placeholder="FZ1001" class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2 uppercase" required>
        </label>
        <button type="submit" class="w-full rounded-xl bg-[var(--fz-char)] py-3 font-bold text-white">Track</button>
    </form>
</div>
@endsection

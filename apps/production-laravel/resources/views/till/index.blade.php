@extends('layouts.franzos')

@section('title', 'Till POS')

@section('content')
<div class="mx-auto max-w-5xl px-4 py-10">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Till POS</h1>
    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        @foreach ($items as $item)
            <form action="{{ route('till.store') }}" method="post" class="rounded border p-3 bg-white">
                @csrf
                <input type="hidden" name="menu_item_id" value="{{ $item->id }}">
                <p class="font-semibold">{{ $item->name }}</p>
                <p class="text-[var(--fz-flame)] font-bold">£{{ number_format($item->price, 2) }}</p>
                <button type="submit" class="mt-2 w-full rounded bg-[var(--fz-char)] text-white text-sm py-2">Quick sale</button>
            </form>
        @endforeach
    </div>
    <h2 class="mt-12 font-semibold">Recent takeaway</h2>
    <ul class="mt-2 text-sm space-y-1">
        @foreach ($recent as $order)
            <li>{{ $order->order_number }} — £{{ number_format($order->total, 2) }}</li>
        @endforeach
    </ul>
</div>
@endsection

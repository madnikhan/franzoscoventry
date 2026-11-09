@extends('layouts.franzos')

@section('title', 'Checkout — '.config('franzos.name'))

@section('content')
<div class="mx-auto max-w-3xl px-4 py-10" x-data="{ type: '{{ $type }}' }">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Your order</h1>

    @if ($errors->any())
        <ul class="mt-4 rounded bg-red-50 text-red-800 p-3 text-sm">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif

    @if (count($lines) === 0)
        <p class="mt-6 text-[var(--fz-muted)]">Your cart is empty. <a href="{{ route('menu') }}" class="text-[var(--fz-flame)] underline">Browse the menu</a>.</p>
    @else
        <ul class="mt-6 space-y-3">
            @foreach ($lines as $line)
                <li class="flex justify-between rounded-lg border border-[var(--fz-sand)] bg-white p-3">
                    <div>
                        <span class="font-semibold">{{ $line['name'] }}</span>
                        @if (!empty($line['customizations']['spice']))
                            <span class="text-xs text-[var(--fz-muted)]"> · {{ $line['customizations']['spice'] }}</span>
                        @endif
                        <span class="text-sm text-[var(--fz-muted)]"> × {{ $line['quantity'] }}</span>
                    </div>
                    <span>£{{ number_format($line['unitPrice'] * $line['quantity'], 2) }}</span>
                </li>
            @endforeach
        </ul>

        <dl class="mt-6 space-y-1 text-sm">
            <div class="flex justify-between"><dt>Subtotal</dt><dd>£{{ number_format($totals['subtotal'], 2) }}</dd></div>
            <div class="flex justify-between"><dt>Delivery</dt><dd>£{{ number_format($totals['deliveryFee'], 2) }}</dd></div>
            <div class="flex justify-between"><dt>VAT</dt><dd>£{{ number_format($totals['vat'], 2) }}</dd></div>
            <div class="flex justify-between text-lg font-bold border-t pt-2"><dt>Total</dt><dd>£{{ number_format($totals['total'], 2) }}</dd></div>
        </dl>

        <form action="{{ route('order.store') }}" method="post" class="mt-8 space-y-4">
            @csrf
            <fieldset>
                <legend class="font-semibold">Order type</legend>
                <div class="mt-2 flex flex-wrap gap-3">
                    @foreach ($orderTypes as $ot)
                        <label class="inline-flex items-center gap-2">
                            <input type="radio" name="type" value="{{ $ot }}" x-model="type" @checked($type === $ot)>
                            {{ ucfirst(strtolower($ot)) }}
                        </label>
                    @endforeach
                </div>
            </fieldset>
            <label class="block">
                <span class="text-sm font-semibold">Name</span>
                <input name="customer_name" required class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2" value="{{ old('customer_name') }}">
            </label>
            <label class="block">
                <span class="text-sm font-semibold">Phone</span>
                <input name="customer_phone" required class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2" value="{{ old('customer_phone') }}">
            </label>
            <label class="block" x-show="type === 'DELIVERY'">
                <span class="text-sm font-semibold">Delivery address</span>
                <textarea name="address" class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2" rows="2">{{ old('address') }}</textarea>
            </label>
            <label class="block">
                <span class="text-sm font-semibold">Payment</span>
                <select name="payment_method" class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2">
                    <option value="card">Card (SumUp)</option>
                    <option value="cash">Cash</option>
                </select>
            </label>
            <label class="block">
                <span class="text-sm font-semibold">Notes</span>
                <textarea name="notes" class="mt-1 w-full rounded-lg border border-[var(--fz-sand)] px-3 py-2" rows="2">{{ old('notes') }}</textarea>
            </label>
            <button type="submit" class="w-full rounded-xl bg-[var(--fz-flame)] py-3 font-bold text-white hover:bg-[var(--fz-flame-deep)]">Place order</button>
        </form>

        <form action="{{ route('order.cart') }}" method="post" class="mt-4">
            @csrf
            <input type="hidden" name="action" value="clear">
            <button type="submit" class="text-sm text-[var(--fz-muted)] underline">Clear cart</button>
        </form>
    @endif
</div>
@endsection

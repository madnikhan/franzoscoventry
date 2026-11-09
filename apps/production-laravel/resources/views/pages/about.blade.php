@extends('layouts.franzos')

@section('title', 'About')

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
    <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">About Franzos</h1>
    <p class="mt-3 max-w-2xl text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">Flame-grilled peri chicken from Corporation Street, Coventry.</p>
    <div class="fz-card mt-8 max-w-3xl p-5 md:p-6">
        <p class="text-[var(--fz-smoke)]">{{ $copy['about'] ?? '' }}</p>
        <p class="mt-4 font-semibold text-[var(--fz-leaf)]">{{ $copy['halalNote'] ?? '' }}</p>
        <p class="mt-4 text-sm font-semibold text-[var(--fz-muted)]">
            {{ config('franzos.address.line1') }}, {{ config('franzos.address.city') }} {{ config('franzos.address.postcode') }}
        </p>
    </div>
</div>
@endsection

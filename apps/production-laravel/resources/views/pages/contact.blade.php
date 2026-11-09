@extends('layouts.franzos')

@section('title', 'Contact')

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
    <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">Contact</h1>
    <p class="mt-3 max-w-2xl text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">Call, email, or visit us in Coventry.</p>
    <div class="fz-card mt-8 max-w-xl space-y-3 p-5 md:p-6">
        <p class="text-lg font-semibold">{{ config('franzos.address.line1') }}, {{ config('franzos.address.city') }} {{ config('franzos.address.postcode') }}</p>
        <p>
            <a href="tel:{{ config('franzos.phoneE164') }}" class="text-lg font-bold text-[var(--fz-tomato)]">{{ config('franzos.phone') }}</a>
        </p>
        <ul class="space-y-1">
            @foreach (config('franzos.emails') as $email)
                <li><a href="mailto:{{ $email }}" class="font-semibold text-[var(--fz-tomato)] underline">{{ $email }}</a></li>
            @endforeach
        </ul>
    </div>
</div>
@endsection

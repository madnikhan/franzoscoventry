@extends('layouts.franzos')

@section('title', 'Contact')

@section('content')
<div class="mx-auto max-w-lg px-4 py-12">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Contact</h1>
    <p class="mt-4">{{ config('franzos.address.line1') }}, {{ config('franzos.address.city') }} {{ config('franzos.address.postcode') }}</p>
    <p class="mt-2"><a href="tel:{{ config('franzos.phoneE164') }}" class="text-[var(--fz-flame)] font-semibold">{{ config('franzos.phone') }}</a></p>
    <ul class="mt-4 space-y-1 text-sm">
        @foreach (config('franzos.emails') as $email)
            <li><a href="mailto:{{ $email }}" class="underline">{{ $email }}</a></li>
        @endforeach
    </ul>
</div>
@endsection

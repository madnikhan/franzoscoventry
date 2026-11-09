@extends('layouts.franzos')

@section('title', 'About')

@section('content')
<div class="mx-auto max-w-3xl px-4 py-12 prose prose-lg">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)] not-prose">About Franzos</h1>
    <p class="mt-6 text-[var(--fz-smoke)]">{{ $copy['about'] ?? '' }}</p>
    <p class="mt-4 font-semibold text-[var(--fz-leaf)]">{{ $copy['halalNote'] ?? '' }}</p>
</div>
@endsection

@extends('layouts.franzos')

@section('title', 'Opening hours')

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 py-6 md:py-14">
    <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">Opening hours</h1>
    <p class="mt-3 max-w-2xl text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">When the flame is on.</p>
    <div class="fz-card mt-8 max-w-md overflow-hidden">
        <table class="w-full text-base">
            @foreach (config('franzos.hours') as $day => $hours)
                <tr class="border-b-[3px] border-[var(--fz-outline)]/15 last:border-b-0">
                    <th class="px-4 py-3 text-left capitalize font-semibold">{{ $day }}</th>
                    <td class="px-4 py-3 text-right">{{ $hours['open'] }} – {{ $hours['close'] }}</td>
                </tr>
            @endforeach
        </table>
    </div>
</div>
@endsection

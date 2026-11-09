@extends('layouts.franzos')

@section('title', 'Opening hours')

@section('content')
<div class="mx-auto max-w-md px-4 py-12">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Opening hours</h1>
    <table class="mt-8 w-full text-sm">
        @foreach (config('franzos.hours') as $day => $hours)
            <tr class="border-b border-[var(--fz-sand)]">
                <th class="py-2 text-left capitalize font-semibold">{{ $day }}</th>
                <td class="py-2 text-right">{{ $hours['open'] }} – {{ $hours['close'] }}</td>
            </tr>
        @endforeach
    </table>
</div>
@endsection

@extends('layouts.franzos')

@section('title', 'Driver login')

@section('content')
<div class="mx-auto max-w-sm px-4 py-16">
    <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Driver login</h1>
    <form action="{{ route('driver.login.post') }}" method="post" class="mt-8 space-y-4">
        @csrf
        <label class="block text-sm font-semibold">Phone
            <input name="phone" class="mt-1 w-full rounded border px-3 py-2" placeholder="+447700900001">
        </label>
        <label class="block text-sm font-semibold">Password
            <input type="password" name="password" class="mt-1 w-full rounded border px-3 py-2">
        </label>
        @error('phone')<p class="text-red-600 text-sm">{{ $message }}</p>@enderror
        <button class="w-full rounded-xl bg-[var(--fz-char)] py-3 text-white font-bold">Sign in</button>
    </form>
    <p class="mt-4 text-xs text-[var(--fz-muted)]">Demo: +447700900001 / driver123</p>
</div>
@endsection

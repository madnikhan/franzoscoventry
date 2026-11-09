<!DOCTYPE html>
<html lang="en">
<head>
    @php
        $siteName = config('franzos.name', 'Franzos Coventry');
        $siteUrl = rtrim(config('franzos.siteUrl') ?: config('app.url'), '/');
        $pageTitle = trim($__env->yieldContent('title', $siteName));
        $pageDescription = trim($__env->yieldContent('meta_description', 'Flame-grilled peri chicken, secret sauces, unforgettable flavour.'));
        $ogImage = $siteUrl.'/og.jpg?v=3';
    @endphp
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $pageTitle }}</title>
    <meta name="description" content="{{ $pageDescription }}">
    <meta name="theme-color" content="#c45a2c">
    <link rel="icon" href="{{ asset('media/logo/franzos-logo-nav.png') }}" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('media/logo/franzos-logo.png') }}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $siteName }}">
    <meta property="og:locale" content="en_GB">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ $pageTitle }}">
    <meta property="og:description" content="{{ $pageDescription }}">
    <meta property="og:image" content="{{ $ogImage }}">
    <meta property="og:image:secure_url" content="{{ $ogImage }}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{{ $siteName }} logo">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $pageTitle }}">
    <meta name="twitter:description" content="{{ $pageDescription }}">
    <meta name="twitter:image" content="{{ $ogImage }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Modak&family=Mouse+Memoirs&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>[x-cloak]{display:none!important}</style>
    @stack('head')
</head>
<body class="flex min-h-screen flex-col antialiased">
    @include('partials.nav')

    @if (session('status'))
        <div class="bg-[var(--fz-leaf)] px-4 py-2 text-center text-sm text-white">{{ session('status') }}</div>
    @endif

    <main class="w-full flex-1 pt-[var(--fz-nav-offset)]">
        @yield('content')
    </main>

    <footer class="relative mt-auto overflow-hidden border-t-[3px] border-[var(--fz-outline)] bg-[var(--fz-canvas)]">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8">
            <nav class="flex flex-wrap gap-4 text-lg font-bold" aria-label="Footer navigation">
                <a href="{{ route('home') }}">Home</a>
                <a href="{{ route('menu') }}">Menu</a>
                <a href="{{ route('about') }}">About</a>
                <a href="{{ route('contact') }}">Contact</a>
            </nav>
            <p class="font-semibold">{{ \App\Support\Copy::get('footerLine', 'Flame-grilled · Halal · Coventry') }}</p>
        </div>
        <div class="footer-juggle relative h-52 md:h-72">
            @foreach (['lettuce','tomato','cheese','patty'] as $ing)
                <img data-juggle src="{{ asset('media/loader/'.$ing.'.svg') }}" alt="" class="absolute h-12 w-12 -translate-x-1/2 md:h-16 md:w-16" />
            @endforeach
            <img src="{{ asset('media/logo/franzos-logo.png') }}" alt="Franzos" class="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-auto max-w-[90%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_4px_0_var(--fz-outline)]" />
        </div>
        <div class="border-t-[3px] border-[var(--fz-outline)]/20 px-4 py-3 text-center text-sm">
            © {{ date('Y') }} {{ config('franzos.name') }} · {{ \App\Support\Copy::get('footerBlurb') }}
        </div>
    </footer>

    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    @stack('scripts')
</body>
</html>

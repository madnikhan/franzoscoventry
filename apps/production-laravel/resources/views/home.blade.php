@extends('layouts.franzos')

@section('title', $copy['brandName'] ?? config('franzos.name'))

@push('head')
    @vite('resources/js/marketing-home.js')
@endpush

@section('content')
    {{-- Loader — weekend burgers hero --}}
    <div id="franzos-loader" role="dialog" aria-modal="true" aria-label="Page loading" class="fixed inset-0 z-[99999] flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[var(--fz-tomato)]">
        @foreach (['#F91814','#EF6F2E','#4C0016'] as $ci => $c)
            <svg data-curtain class="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" style="z-index: {{ 10 - $ci }}">
                <path d="M0 0 H100 V88 Q50 100 0 88 Z" fill="{{ $c }}" />
            </svg>
        @endforeach
        <div class="relative z-30 mb-[4vw] flex flex-col items-center max-md:mb-[10vw]">
            <div id="loader-stack" class="relative flex items-center justify-center" style="width:min(86vw,460px);height:min(86vw,460px)" aria-hidden="true">
                <img
                    id="loader-hero"
                    src="{{ asset('media/loader/weekend-burgers.png') }}"
                    alt=""
                    class="h-full w-full object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.4)]"
                />
                <div id="loader-crumbs" class="pointer-events-none absolute inset-0 flex items-center justify-center">
                    @for ($i = 0; $i < 10; $i++)
                        <span data-crumb class="absolute h-2 w-2 rounded-full md:h-2.5 md:w-2.5" style="background: {{ $i % 3 === 0 ? '#FFD750' : ($i % 3 === 1 ? '#FFF6EE' : '#F91814') }}"></span>
                    @endfor
                </div>
            </div>
            <p class="loader-ready mt-2 scale-75 text-center font-display text-[clamp(1.75rem,6vw,3.5rem)] tracking-wide text-white opacity-0">{{ $copy['loaderReady'] ?? 'READY TO FRANZOS!' }}</p>
            <p id="loader-status" class="mt-3 max-w-[90vw] text-center text-[clamp(0.7rem,2.5vw,1rem)] font-semibold tracking-widest text-white/90">FIRING UP THE FLAME GRILL...</p>
            <div class="mt-5 h-2 w-[56vw] max-w-[320px] overflow-hidden rounded-full bg-black/20 md:w-80">
                <div id="loader-progress" class="h-full w-0 rounded-full bg-[var(--fz-mustard)]"></div>
            </div>
        </div>
    </div>

    {{-- Hero --}}
    <section id="hero" class="relative -mt-[calc(14vw+5.5rem)] min-h-[110vw] overflow-hidden bg-[var(--fz-canvas)] px-[4vw] pt-[22vw] pb-[12vw] max-md:min-h-[185vw] max-md:pt-[calc(8vw+1rem)] md:-mt-40 md:min-h-[85vh] md:pt-32 md:pb-24">
        <div class="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <img src="{{ asset('media/hero/feast-table.jpg') }}" alt="" class="h-full w-full object-cover object-center" />
            <div class="absolute inset-0 bg-gradient-to-b from-[var(--fz-canvas)]/92 via-[var(--fz-canvas)]/78 to-[var(--fz-canvas)]/95"></div>
            <div class="absolute inset-0 bg-gradient-to-tr from-[var(--fz-tomato)]/25 via-transparent to-[var(--fz-outline)]/20"></div>
        </div>
        <p class="relative z-30 text-center text-[clamp(0.7rem,1.5vw,1rem)] font-bold tracking-[0.2em] text-[var(--fz-outline)]/70">{{ $copy['heroEyebrow'] ?? '' }}</p>
        <div class="relative z-30 mx-auto mt-[1vw] max-w-6xl text-center">
            <div id="hero-dish-dots" class="pointer-events-auto absolute left-0 top-1/2 z-40 flex max-h-[min(48vh,420px)] -translate-y-1/2 flex-col items-center gap-1.5 overflow-y-auto py-1 max-md:left-1 max-md:max-h-[32vh] md:left-[1vw] md:gap-2" role="tablist" aria-label="Dish slides"></div>
            <span id="hero-sticker-left" class="fz-sticker absolute left-[2vw] top-[8vw] z-40 -rotate-12 max-md:left-[8%]">{{ $copy['stickerFresh'] ?? 'FLAME GRILLED' }}</span>
            <span id="hero-sticker-right" class="fz-sticker absolute right-[2vw] top-[18vw] z-40 rotate-8 max-md:right-0">{{ $copy['stickerBold'] ?? 'SECRET SAUCE' }}</span>
            <h1 class="hero-title fz-outline-text relative z-30 font-display text-[clamp(3.5rem,14vw,9rem)] leading-[0.82]">{{ $copy['heroHeadline'] ?? 'THE FLAME' }}</h1>
            <p class="fz-outline-text relative z-20 mt-[0.5vw] font-display text-[clamp(2.2rem,9vw,5.5rem)] leading-none">{{ $copy['heroHeadlineAlt'] ?? 'THE CHICKEN' }}</p>
        </div>
        <div class="relative z-[25] -mt-[10vw] flex justify-center max-md:-mt-[8vw] md:-mt-16">
            <div class="relative mx-auto aspect-square w-[min(680px,62vw)] max-md:w-[min(88vw,560px)]">
                <div class="pointer-events-none absolute left-1/2 top-[82%] h-[16%] w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(76,0,22,0.42)_0%,transparent_72%)] blur-[3px]" aria-hidden="true"></div>
                <div id="hero-food-stage" class="absolute inset-0" aria-live="polite"></div>
            </div>
        </div>
        <div class="relative z-30 mx-auto -mt-[2vw] flex max-w-xl flex-col items-center text-center max-md:mt-0 md:-mt-4">
            <p class="text-[clamp(1rem,2vw,1.25rem)] font-semibold">{{ $copy['heroSub'] ?? '' }}</p>
            <a href="{{ route('order.checkout') }}" data-cursor-hide class="fz-btn mt-[3vw] max-md:mt-8">{{ $copy['ctaOrder'] ?? 'Order Now' }}</a>
        </div>
    </section>

    <section class="bg-[var(--fz-canvas)] px-[4vw] py-[8vw] text-center max-md:py-16">
        <p class="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[var(--fz-tomato)]">TOP CLASSIC</p>
        <h2 class="fz-outline-text mx-auto mt-[1.5vw] max-w-5xl font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9]">{{ $copy['statementTitle'] ?? '' }}</h2>
        <p class="mx-auto mt-[2vw] max-w-2xl text-[clamp(1rem,2vw,1.35rem)] font-semibold">{{ $copy['statementBody'] ?? '' }}</p>
        <a href="{{ route('order.checkout') }}" class="fz-btn mt-[3vw] inline-flex max-md:mt-8">{{ $copy['ctaOrder'] ?? 'Order Now' }}</a>
    </section>

    <section class="bg-[var(--fz-tomato)] px-[4vw] py-[8vw] text-white max-md:py-16">
        <div class="mx-auto max-w-5xl text-center">
            <p class="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.2em] text-[var(--fz-mustard)]">EXPERIENCE</p>
            <h2 class="mt-[1vw] font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none">{{ $copy['feelGoodTitle'] ?? '' }}</h2>
            <p class="mt-[1.5vw] text-[clamp(1rem,2vw,1.25rem)]">100% Halal · Fresh Ingredients · Bold Flavour</p>
            <p class="mt-[2vw] inline-block rounded-xl border-[3px] border-[var(--fz-outline)] bg-[var(--fz-mustard)] px-4 py-2 font-bold text-[var(--fz-outline)]">{{ $copy['feelGoodBand'] ?? 'BOLD FLAVOUR' }}</p>
        </div>
    </section>

    <section class="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img src="{{ asset('media/hero/story-feast.jpg') }}" alt="" class="absolute inset-0 h-full w-full object-cover" />
        <div class="absolute inset-0 bg-[var(--fz-outline)]/55"></div>
        <div class="pointer-events-none absolute inset-x-0 top-0 z-20 leading-[0]" style="color: var(--fz-tomato)" aria-hidden="true">
            <svg class="block h-14 w-full md:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M0 0 H1440 V32 Q1260 74 1080 32 T720 32 T360 32 T0 32 Z">
                    <animate attributeName="d" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" keyTimes="0;0.5;1"
                        values="M0 0 H1440 V32 Q1260 74 1080 32 T720 32 T360 32 T0 32 Z;M0 0 H1440 V44 Q1260 8 1080 44 T720 44 T360 44 T0 44 Z;M0 0 H1440 V32 Q1260 74 1080 32 T720 32 T360 32 T0 32 Z" />
                </path>
            </svg>
        </div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 leading-[0]" style="color: var(--fz-mustard)" aria-hidden="true">
            <svg class="block h-14 w-full md:h-16" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M0 48 Q180 6 360 48 T720 48 T1080 48 T1440 48 V80 H0 Z">
                    <animate attributeName="d" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1; 0.45 0 0.55 1" keyTimes="0;0.5;1"
                        values="M0 48 Q180 6 360 48 T720 48 T1080 48 T1440 48 V80 H0 Z;M0 36 Q180 72 360 36 T720 36 T1080 36 T1440 36 V80 H0 Z;M0 48 Q180 6 360 48 T720 48 T1080 48 T1440 48 V80 H0 Z" />
                </path>
            </svg>
        </div>
        <div class="relative z-10 flex min-h-[420px] flex-col items-center justify-center px-[4vw] py-16 text-center text-white md:min-h-[520px]">
            <h2 class="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none">{{ $copy['storyTitle'] ?? '' }}</h2>
            <p class="mt-[2vw] max-w-xl text-[clamp(1rem,2vw,1.35rem)]">{{ $copy['storyBody'] ?? '' }}</p>
        </div>
    </section>

    <section class="bg-[var(--fz-mustard)] px-[4vw] py-[8vw] text-[var(--fz-outline)] max-md:py-16">
        <p class="text-center text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em]">TAKE AWAY</p>
        <h2 class="fz-outline-text mx-auto mt-[1.5vw] max-w-5xl text-center font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-[0.9]">{{ $copy['travelsTitle'] ?? '' }}</h2>
        <p class="mx-auto mt-[2vw] max-w-2xl text-center text-[clamp(1rem,2vw,1.25rem)] font-semibold">{{ $copy['travelsBody'] ?? '' }}</p>
        <div class="mx-auto mt-[3vw] flex max-w-4xl flex-wrap justify-center gap-3 max-md:mt-8">
            @foreach (['COVENTRY','EARLSDON','FOLESHILL','CANLEY','TILE HILL'] as $c)
                <span class="rounded-full border-[3px] border-[var(--fz-outline)] bg-white px-4 py-2 font-bold shadow-[3px_3px_0_var(--fz-outline)]">{{ $c }}˝</span>
            @endforeach
        </div>
    </section>

    <section class="bg-[var(--fz-canvas)] px-[4vw] py-[10vw] text-center max-md:py-20">
        <p class="text-[clamp(0.7rem,1.4vw,0.95rem)] font-bold tracking-[0.25em] text-[var(--fz-tomato)]">FEEL IT</p>
        <h2 class="fz-outline-text mx-auto mt-[1.5vw] max-w-3xl font-display text-[clamp(2.5rem,8vw,5rem)] leading-none">{{ $copy['changeTitle'] ?? '' }}</h2>
        <p class="mx-auto mt-[2vw] max-w-2xl text-[clamp(1rem,2vw,1.35rem)] font-semibold">{{ $copy['changeBody'] ?? '' }}</p>
        <a href="{{ route('order.checkout') }}" class="fz-btn mt-[3vw] inline-flex max-md:mt-8">{{ $copy['ctaOrder'] ?? 'Order Now' }}</a>
    </section>
@endsection

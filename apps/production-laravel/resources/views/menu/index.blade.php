@extends('layouts.franzos')

@section('title', 'Menu — '.config('franzos.name'))

@section('content')
@php
    $phone = config('franzos.phoneE164') ?? config('franzos.phone');
@endphp
<div class="mx-auto min-w-0 w-full max-w-6xl px-4 py-6 md:py-14">
    <div class="flex flex-wrap items-end justify-between gap-3">
        <div class="min-w-0">
            <h1 class="fz-outline-text font-display break-words text-[clamp(2rem,9vw,3.75rem)] leading-none tracking-wide md:text-6xl">Our menu</h1>
            <p class="mt-3 max-w-2xl text-base font-semibold text-[var(--fz-outline)]/80 md:text-lg">Browse by category — call us to order, or add to cart.</p>
        </div>
        @if ($phone)
            <a href="tel:{{ $phone }}" class="inline-flex items-center rounded-full border-[3px] border-[var(--fz-outline)] bg-[var(--fz-mustard)] px-4 py-2 text-sm font-bold text-[var(--fz-outline)] shadow-[3px_3px_0_var(--fz-outline)] md:hidden">
                Call to order
            </a>
        @endif
    </div>

    <nav
        aria-label="Menu categories"
        class="sticky top-[var(--fz-nav-sticky)] z-20 -mx-4 mt-6 flex min-w-0 w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain bg-[var(--fz-canvas)]/95 px-4 py-3 backdrop-blur-sm [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-md:border-b max-md:border-[var(--fz-outline)]/30 lg:mx-0 lg:mt-8 lg:grid lg:grid-cols-5 lg:gap-2 lg:overflow-visible lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
    >
        @foreach ($categories as $category)
            <a
                href="#{{ $category->slug }}"
                class="snap-start shrink-0 rounded-full border-2 border-[var(--fz-outline)] bg-[var(--fz-surface)] px-3.5 py-2 text-center text-sm font-bold text-[var(--fz-ink)] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition hover:bg-[var(--fz-mustard)] hover:text-[#120d14] lg:w-full"
            >
                {{ $category->name }}
            </a>
        @endforeach
    </nav>

    @foreach ($categories as $category)
        <section class="mt-10 scroll-mt-[calc(var(--fz-nav-sticky)+1rem)]" id="{{ $category->slug }}">
            <h2 class="font-display text-3xl tracking-wide md:text-4xl">{{ $category->name }}</h2>
            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                @foreach ($category->menuItems as $item)
                    <article class="fz-card min-w-0 overflow-hidden">
                        @if ($item->image)
                            <div class="aspect-[4/3] overflow-hidden bg-[var(--fz-elevated)]">
                                <img
                                    src="{{ $item->image }}"
                                    alt=""
                                    loading="lazy"
                                    class="h-full w-full {{ str_ends_with($item->image, '.png') ? 'object-contain p-3' : 'object-cover' }}"
                                >
                            </div>
                        @endif
                        <div class="min-w-0 p-4 md:p-5">
                            <h3 class="min-w-0 break-words font-display text-xl leading-tight md:text-2xl">{{ $item->name }}</h3>
                            <p class="mt-1 text-sm text-[var(--fz-muted)] line-clamp-2">{{ $item->description }}</p>
                            <p class="mt-2 font-bold text-[var(--fz-flame)]">£{{ number_format($item->price, 2) }}</p>
                            <form action="{{ route('menu.cart') }}" method="post" class="mt-3 flex flex-wrap gap-2 items-end">
                                @csrf
                                <input type="hidden" name="item_id" value="{{ $item->external_id }}">
                                <input type="hidden" name="name" value="{{ $item->name }}">
                                <input type="hidden" name="price" value="{{ $item->price }}">
                                @if ($item->spice_selectable)
                                    <label class="text-xs">
                                        Spice
                                        <select name="spice" class="mt-1 block rounded border border-[var(--fz-sand)] text-sm">
                                            <option value="mild">Mild</option>
                                            <option value="medium">Medium</option>
                                            <option value="hot">Hot</option>
                                            <option value="extra-hot">Extra Hot</option>
                                        </select>
                                    </label>
                                @endif
                                <div class="ml-auto flex gap-2">
                                    @if ($phone)
                                        <a href="tel:{{ $phone }}" class="rounded-lg border border-[var(--fz-outline)] bg-white px-3 py-2 text-sm font-semibold text-[var(--fz-outline)] md:hidden">Call</a>
                                    @endif
                                    <button type="submit" class="rounded-lg bg-[var(--fz-flame)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--fz-flame-deep)]">Add</button>
                                </div>
                            </form>
                        </div>
                    </article>
                @endforeach
            </div>
        </section>
    @endforeach

    <div class="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
        @if ($phone)
            <a href="tel:{{ $phone }}" class="rounded-full bg-[var(--fz-mustard)] px-5 py-3 text-sm font-bold text-[var(--fz-outline)] shadow-[var(--fz-shadow)] border-[3px] border-[var(--fz-outline)] md:hidden">
                Call {{ config('franzos.phone') }}
            </a>
        @endif
        <a href="{{ route('order.checkout') }}" class="rounded-full bg-[var(--fz-char)] px-6 py-3 text-white font-semibold shadow-[var(--fz-shadow)]">
            Cart ({{ $cartCount }})
        </a>
    </div>
</div>
@endsection

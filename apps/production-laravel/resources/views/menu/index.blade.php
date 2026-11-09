@extends('layouts.franzos')

@section('title', 'Menu — '.config('franzos.name'))

@section('content')
@php
    $phone = config('franzos.phoneE164') ?? config('franzos.phone');
@endphp
<div class="mx-auto max-w-6xl px-4 py-10 md:py-14">
    <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
            <h1 class="font-[family-name:var(--fz-font-display)] text-4xl text-[var(--fz-flame)]">Menu</h1>
            <p class="mt-2 text-[var(--fz-muted)]">Browse by category — call us to order, or add to cart.</p>
        </div>
        @if ($phone)
            <a href="tel:{{ $phone }}" class="inline-flex items-center rounded-full border-[3px] border-[var(--fz-outline)] bg-[var(--fz-mustard)] px-4 py-2 text-sm font-bold text-[var(--fz-outline)] shadow-[3px_3px_0_var(--fz-outline)] md:hidden">
                Call to order
            </a>
        @endif
    </div>

    <nav
        aria-label="Menu categories"
        class="sticky top-[calc(14vw+3.25rem)] z-20 -mx-4 mt-6 flex gap-2 overflow-x-auto bg-[var(--fz-cream)]/95 px-4 py-3 backdrop-blur-sm [scrollbar-width:none] snap-x snap-mandatory [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:top-24 lg:mx-0 lg:mt-8 lg:grid lg:grid-cols-5 lg:gap-2 lg:overflow-visible lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
    >
        @foreach ($categories as $category)
            <a
                href="#{{ $category->slug }}"
                class="snap-start shrink-0 rounded-full border-[3px] border-[var(--fz-outline)] bg-white px-3.5 py-2 text-center text-sm font-bold text-[var(--fz-outline)] shadow-[3px_3px_0_var(--fz-outline)] transition hover:bg-[var(--fz-mustard)] lg:w-full"
            >
                {{ $category->name }}
            </a>
        @endforeach
    </nav>

    @foreach ($categories as $category)
        <section class="mt-10 scroll-mt-36 md:scroll-mt-28" id="{{ $category->slug }}">
            <h2 class="font-[family-name:var(--fz-font-display)] text-3xl tracking-wide">{{ $category->name }}</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                @foreach ($category->menuItems as $item)
                    <article class="overflow-hidden rounded-[var(--fz-radius)] border-[3px] border-[var(--fz-outline)] bg-white shadow-[var(--fz-shadow)]">
                        @if ($item->image)
                            <div class="aspect-[5/4] overflow-hidden bg-[var(--fz-cream)]">
                                <img
                                    src="{{ $item->image }}"
                                    alt=""
                                    loading="lazy"
                                    class="h-full w-full {{ str_ends_with($item->image, '.png') ? 'object-contain p-3' : 'object-cover' }}"
                                >
                            </div>
                        @endif
                        <div class="p-4">
                            <h3 class="font-semibold text-lg">{{ $item->name }}</h3>
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

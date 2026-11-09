@php
    $ops = request()->is('kitchen*') || request()->is('driver*') || request()->is('till*') || request()->is('admin*');
@endphp

@if ($ops)
<nav class="fixed top-0 left-0 z-[999] w-full bg-[var(--fz-canvas)]/95 px-[2.5vw] py-[1vw] backdrop-blur max-md:px-[4vw] max-md:py-[3vw]">
    <div class="flex items-center justify-between gap-3">
        <a href="{{ route('home') }}">
            <img src="{{ asset('media/logo/franzos-logo-nav.png') }}" alt="Franzos" class="h-[10vw] max-h-16 w-auto max-md:h-[14vw] md:h-20" />
        </a>
        <div class="flex flex-wrap gap-2 text-sm font-bold">
            <a href="{{ route('kitchen') }}" class="rounded-full bg-white px-3 py-1.5">Kitchen</a>
            <a href="{{ url('/driver') }}" class="rounded-full bg-white px-3 py-1.5">Driver</a>
            <a href="{{ route('till') }}" class="rounded-full bg-white px-3 py-1.5">Till</a>
            <a href="{{ route('admin') }}" class="rounded-full bg-white px-3 py-1.5">Admin</a>
        </div>
    </div>
</nav>
@else
@php
    $navCartCount = app(\App\Services\CartService::class)->count();
@endphp
<nav class="fixed top-0 left-0 z-[999] flex w-full items-center justify-between px-[2.5vw] py-[1vw] max-md:px-[4vw] max-md:py-[2.5vw]" x-data="{ open: false }">
    <a href="{{ route('home') }}" class="group relative z-10 flex shrink-0 items-center self-center">
        <img
            src="{{ asset('media/logo/franzos-logo-nav.png') }}"
            alt="Franzos"
            class="h-20 w-auto max-w-[46vw] object-contain object-left transition duration-300 group-hover:scale-105 group-hover:-rotate-3 max-md:h-[20vw] max-md:max-w-[48vw] md:h-24 lg:h-[9vw] lg:max-h-28 lg:max-w-[24vw]"
        />
        <span class="sr-only">Franzos</span>
    </a>

    <div class="relative z-10 flex items-center gap-2 max-md:gap-[3vw] lg:gap-[1vw]">
        <a
            href="{{ route('menu') }}"
            data-cursor-hide
            class="flex items-center justify-center rounded-full bg-[var(--fz-tomato)] px-4 py-2 font-display text-sm uppercase tracking-wide text-[var(--fz-canvas)] transition-all duration-300 hover:scale-105 hover:bg-[var(--fz-outline)] max-md:px-[5vw] max-md:py-[1.8vw] max-md:text-[4vw] lg:px-[1.6vw] lg:py-[0.5vw] lg:text-[1.3vw]"
        >Menu</a>

        <a
            href="{{ route('order.checkout') }}"
            data-cursor-hide
            aria-label="{{ $navCartCount > 0 ? 'Cart, '.$navCartCount.' items' : 'Cart' }}"
            class="relative flex items-center justify-center rounded-full border-2 border-[var(--fz-outline)] bg-[var(--fz-mustard)] px-3.5 py-2 text-[var(--fz-outline)] shadow-[2px_2px_0_var(--fz-outline)] transition-all duration-300 hover:scale-105 max-md:border-[0.4vw] max-md:px-[3.5vw] max-md:py-[1.6vw] lg:border-[0.15vw] lg:px-[1.2vw] lg:py-[0.45vw]"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-5 w-5 fill-none stroke-current stroke-[2.2] lg:h-[1.45vw] lg:w-[1.45vw] lg:min-h-5 lg:min-w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.5 5h1.6l1.3 9.2a1.6 1.6 0 0 0 1.6 1.3h8.2a1.6 1.6 0 0 0 1.6-1.3L19.5 8H7" />
                <circle cx="9.2" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="16.2" cy="19.2" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            @if ($navCartCount > 0)
                <span class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--fz-tomato)] px-1 text-[0.65rem] font-bold leading-none text-white shadow-[1px_1px_0_var(--fz-outline)]">
                    {{ $navCartCount > 99 ? '99+' : $navCartCount }}
                </span>
            @endif
        </a>

        <div class="relative">
            <button
                type="button"
                data-cursor-hide
                :aria-label="open ? 'Close site menu' : 'Open site menu'"
                :aria-expanded="open.toString()"
                aria-controls="main-menu"
                @click="open = !open"
                class="flex cursor-pointer items-center gap-2 rounded-full border-2 border-[var(--fz-tomato)] bg-[var(--fz-tomato)] px-4 py-2 font-display text-sm uppercase tracking-wide text-[var(--fz-canvas)] transition-all duration-300 hover:scale-105 max-md:gap-[2vw] max-md:border-[0.4vw] max-md:px-[4vw] max-md:py-[1.8vw] max-md:text-[4vw] lg:gap-[0.6vw] lg:border-[0.15vw] lg:px-[1.4vw] lg:py-[0.5vw] lg:text-[1.3vw]"
            >
                <template x-if="open">
                    <span class="inline-flex items-center gap-[0.5vw]">Close <span aria-hidden class="text-[1.2em] leading-none">×</span></span>
                </template>
                <template x-if="!open">
                    <span aria-hidden class="inline-flex h-4 w-5 flex-col justify-center gap-1 lg:h-[1.2vw] lg:min-h-[1.1rem] lg:w-[1.6vw] lg:min-w-[1.25rem] lg:gap-[0.28vw]">
                        <span class="block h-0.5 w-full rounded-full bg-[var(--fz-canvas)] lg:h-[0.22vw] lg:min-h-[2px]"></span>
                        <span class="block h-0.5 w-full rounded-full bg-[var(--fz-canvas)] lg:h-[0.22vw] lg:min-h-[2px]"></span>
                        <span class="block h-0.5 w-full rounded-full bg-[var(--fz-canvas)] lg:h-[0.22vw] lg:min-h-[2px]"></span>
                    </span>
                </template>
            </button>

            <div
                id="main-menu"
                role="menu"
                x-show="open"
                x-cloak
                x-transition:enter="transition ease-out duration-200"
                x-transition:enter-start="opacity-0 scale-90 -translate-y-2"
                x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                x-transition:leave="transition ease-in duration-150"
                x-transition:leave-start="opacity-100 scale-100"
                x-transition:leave-end="opacity-0 scale-90"
                class="absolute top-[calc(100%+0.75rem)] right-0 w-[min(22rem,calc(100vw-1.5rem))] origin-top-right rounded-2xl bg-[var(--fz-tomato)] p-5 shadow-[0_12px_32px_rgba(27,27,27,.25)] max-md:mt-[5vw] max-md:rounded-[4vw] max-md:p-[6vw] lg:top-[calc(100%+1vw)] lg:w-[min(18vw,22rem)] lg:rounded-[1.2vw] lg:p-[2vw] lg:shadow-[0_1vw_3vw_rgba(27,27,27,.25)]"
                @click.outside="open = false"
            >
                <ul class="flex flex-col gap-3 max-md:gap-[4vw] lg:gap-[1.2vw]">
                    <li><a role="menuitem" href="{{ route('home') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Home</a></li>
                    <li><a role="menuitem" href="{{ route('about') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">About</a></li>
                    <li><a role="menuitem" href="{{ route('menu') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Menu</a></li>
                    <li><a role="menuitem" href="{{ route('opening-hours') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Hours</a></li>
                    <li><a role="menuitem" href="{{ route('contact') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Contact</a></li>
                    <li><a role="menuitem" href="{{ route('order.checkout') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Order{{ $navCartCount > 0 ? ' / Cart ('.$navCartCount.')' : ' / Cart' }}</a></li>
                    <li><a role="menuitem" href="{{ route('track.index') }}" class="block font-display text-base uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw] lg:text-[1.6vw]">Track</a></li>
                </ul>
                <p class="mt-4 border-t border-white/30 pt-3 text-xs font-semibold uppercase tracking-wider text-[var(--fz-canvas)]/80 max-md:mt-[5vw] max-md:pt-[4vw] max-md:text-[3.2vw] lg:mt-[2vw] lg:pt-[1.2vw] lg:text-[0.85vw]">
                    Est. Coventry — Corporation Street
                </p>
            </div>
        </div>
    </div>
</nav>
@endif

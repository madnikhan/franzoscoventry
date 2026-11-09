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
    <a href="{{ route('home') }}" class="group relative z-10 shrink-0">
        <img
            src="{{ asset('media/logo/franzos-logo-nav.png') }}"
            alt="Franzos"
            class="h-[9vw] w-auto max-w-[22vw] transition duration-300 group-hover:scale-105 group-hover:-rotate-3 max-md:h-[12vw] max-md:max-w-[28vw] md:h-24"
        />
        <span class="sr-only">Franzos</span>
    </a>

    <div class="relative z-10 flex items-center gap-[1vw] max-md:gap-[3vw]">
        <a
            href="{{ route('menu') }}"
            data-cursor-hide
            class="flex items-center justify-center rounded-full bg-[var(--fz-tomato)] px-[1.6vw] py-[0.5vw] font-display text-[1.3vw] uppercase tracking-wide text-[var(--fz-canvas)] transition-all duration-300 hover:scale-105 hover:bg-[var(--fz-outline)] max-md:px-[5vw] max-md:py-[1.8vw] max-md:text-[4vw]"
        >Menu</a>

        <a
            href="{{ route('order.checkout') }}"
            data-cursor-hide
            aria-label="{{ $navCartCount > 0 ? 'Cart, '.$navCartCount.' items' : 'Cart' }}"
            class="relative flex items-center justify-center rounded-full border-[0.15vw] border-[var(--fz-outline)] bg-[var(--fz-mustard)] px-[1.2vw] py-[0.45vw] text-[var(--fz-outline)] shadow-[2px_2px_0_var(--fz-outline)] transition-all duration-300 hover:scale-105 max-md:border-[0.4vw] max-md:px-[3.5vw] max-md:py-[1.6vw]"
        >
            <svg viewBox="0 0 24 24" aria-hidden="true" class="h-[1.45vw] w-[1.45vw] min-h-5 min-w-5 fill-none stroke-current stroke-[2.2]">
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
                class="flex cursor-pointer items-center gap-[0.6vw] rounded-full border-[0.15vw] border-[var(--fz-tomato)] bg-[var(--fz-tomato)] px-[1.4vw] py-[0.5vw] font-display text-[1.3vw] uppercase tracking-wide text-[var(--fz-canvas)] transition-all duration-300 hover:scale-105 max-md:gap-[2vw] max-md:border-[0.4vw] max-md:px-[4vw] max-md:py-[1.8vw] max-md:text-[4vw]"
            >
                <template x-if="open">
                    <span class="inline-flex items-center gap-[0.5vw]">Close <span aria-hidden class="text-[1.2em] leading-none">×</span></span>
                </template>
                <template x-if="!open">
                    <span aria-hidden class="inline-flex h-[1.2vw] min-h-[1.1rem] w-[1.6vw] min-w-[1.25rem] flex-col justify-center gap-[0.28vw] max-md:h-4 max-md:w-5 max-md:gap-1">
                        <span class="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[var(--fz-canvas)] max-md:h-0.5"></span>
                        <span class="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[var(--fz-canvas)] max-md:h-0.5"></span>
                        <span class="block h-[0.22vw] min-h-[2px] w-full rounded-full bg-[var(--fz-canvas)] max-md:h-0.5"></span>
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
                class="absolute top-[calc(100%+1vw)] right-0 w-[18vw] origin-top-right rounded-[1.2vw] bg-[var(--fz-tomato)] p-[2vw] shadow-[0_1vw_3vw_rgba(27,27,27,.25)] max-md:mt-[5vw] max-md:w-[91vw] max-md:rounded-[4vw] max-md:p-[6vw]"
                @click.outside="open = false"
            >
                <ul class="flex flex-col gap-[1.2vw] max-md:gap-[4vw]">
                    <li><a role="menuitem" href="{{ route('home') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Home</a></li>
                    <li><a role="menuitem" href="{{ route('about') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">About</a></li>
                    <li><a role="menuitem" href="{{ route('menu') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Menu</a></li>
                    <li><a role="menuitem" href="{{ route('opening-hours') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Hours</a></li>
                    <li><a role="menuitem" href="{{ route('contact') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Contact</a></li>
                    <li><a role="menuitem" href="{{ route('order.checkout') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Order</a></li>
                    <li><a role="menuitem" href="{{ route('track.index') }}" class="block font-display text-[1.6vw] uppercase tracking-wide text-[var(--fz-canvas)] hover:text-[var(--fz-mustard)] max-md:text-[7vw]">Track</a></li>
                </ul>
                <p class="mt-[2vw] border-t border-white/30 pt-[1.2vw] text-[0.85vw] font-semibold uppercase tracking-wider text-[var(--fz-canvas)]/80 max-md:mt-[5vw] max-md:pt-[4vw] max-md:text-[3.2vw]">
                    Est. Coventry — Corporation Street
                </p>
            </div>
        </div>
    </div>
</nav>
@endif

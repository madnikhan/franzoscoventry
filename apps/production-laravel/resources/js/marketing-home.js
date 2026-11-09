import gsap from 'gsap';

const LOADER_KEY = 'franzos_loader_weekend_v1';

document.addEventListener('DOMContentLoaded', () => {
    runLoader();
    runHero();
    runFooterJuggle();
});

function runLoader() {
    const root = document.getElementById('franzos-loader');
    const stack = document.getElementById('loader-stack');
    const hero = document.getElementById('loader-hero');
    const status = document.getElementById('loader-status');
    const bar = document.getElementById('loader-progress');
    if (!root || !stack || !hero) return;

    const finish = () => {
        try {
            sessionStorage.setItem(LOADER_KEY, '1');
        } catch {
            /* ignore */
        }
        document.body.style.overflow = '';
        root.remove();
    };

    let seen = false;
    try {
        seen = sessionStorage.getItem(LOADER_KEY) === '1';
    } catch {
        seen = false;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || seen) {
        finish();
        return;
    }

    const curtains = root.querySelectorAll('[data-curtain]');
    const crumbs = root.querySelectorAll('[data-crumb]');
    const labels = [
        'FIRING UP THE FLAME GRILL...',
        'STACKING THE WEEKEND BURGERS...',
        'MELTING THE SECRET SAUCE...',
        'READY TO SERVE FRANZOS...',
    ];

    document.body.style.overflow = 'hidden';
    gsap.set(hero, { y: -420, opacity: 0, scale: 0.72, rotate: -6 });
    gsap.set(crumbs, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ onComplete: finish });

    tl.to(hero, {
        y: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.55,
        ease: 'back.out(1.4)',
        onStart: () => {
            if (status) status.textContent = labels[0];
        },
    });

    labels.slice(1).forEach((label, i) => {
        tl.call(() => {
            if (status) status.textContent = label;
        }, undefined, 0.35 + i * 0.28);
    });

    const prog = { v: 0 };
    tl.to(
        prog,
        {
            v: 100,
            duration: 1.2,
            ease: 'none',
            onUpdate: () => {
                if (bar) bar.style.width = `${Math.round(prog.v)}%`;
            },
        },
        0
    );

    tl.to(
        hero,
        { y: -14, scale: 1.04, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        0.55
    );

    crumbs.forEach((c, i) => {
        const angle = (i / crumbs.length) * Math.PI * 2;
        const dist = 110 + (i % 3) * 26;
        tl.to(
            c,
            {
                opacity: 1,
                scale: 1,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 20,
                duration: 0.4,
                ease: 'power2.out',
            },
            '-=0.08'
        );
        tl.to(c, { opacity: 0, duration: 0.22 }, '-=0.18');
    });

    tl.to('.loader-ready', { opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(2)' }, '-=0.28');
    tl.to(hero, { y: -28, scale: 1.06, duration: 0.2, ease: 'power2.out' }, '-=0.1');
    tl.to(hero, { y: 0, scale: 1, duration: 0.26, ease: 'bounce.out' });
    tl.to(hero, { y: -900, opacity: 0, duration: 0.38, ease: 'power2.in' }, '+=0.05');

    curtains.forEach((curtain, i) => {
        tl.to(curtain, { yPercent: -125, duration: 0.45, ease: 'power2.inOut' }, `+=${i === 0 ? 0.02 : 0.04}`);
    });
    tl.to(root, { autoAlpha: 0, duration: 0.1 }, '-=0.15');
}

function runHero() {
    const stage = document.getElementById('hero-food-stage');
    const dotsRoot = document.getElementById('hero-dish-dots');
    const stickerL = document.getElementById('hero-sticker-left');
    const stickerR = document.getElementById('hero-sticker-right');
    if (!stage) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const HOLD_MS = 3500;
    const STAGGER = 0.28;
    let dishes = [];
    let active = 0;
    let floatTween = null;
    let cycleToken = 0;

    const renderDots = () => {
        if (!dotsRoot) return;
        dotsRoot.innerHTML = dishes
            .map(
                (d, i) =>
                    `<button type="button" role="tab" aria-selected="${i === active}" aria-label="Show ${d.name}" data-dish-index="${i}" class="w-2 rounded-full border border-[var(--fz-outline)] transition-all md:w-2.5 ${
                        i === active
                            ? 'h-4 bg-[var(--fz-tomato)] md:h-5'
                            : 'h-2 bg-[var(--fz-mustard)]/80 md:h-2.5'
                    }"></button>`
            )
            .join('');
        dotsRoot.querySelectorAll('[data-dish-index]').forEach((btn) => {
            btn.addEventListener('click', () => showDish(Number(btn.getAttribute('data-dish-index'))));
        });
    };

    const updateStickers = (dish) => {
        if (stickerL && dish.badges?.[0]) stickerL.textContent = dish.badges[0];
        if (stickerR && dish.badges?.[1]) stickerR.textContent = dish.badges[1];
    };

    const showDish = (index) => {
        if (!dishes.length) return;
        active = ((index % dishes.length) + dishes.length) % dishes.length;
        const dish = dishes[active];
        const token = ++cycleToken;
        updateStickers(dish);
        renderDots();

        if (floatTween) {
            floatTween.kill();
            floatTween = null;
        }

        stage.innerHTML = '';
        const wrap = document.createElement('div');
        wrap.className = 'absolute inset-0';
        wrap.setAttribute('aria-label', dish.name);
        (dish.layers || []).forEach((layer) => {
            const img = document.createElement('img');
            img.src = layer.src;
            img.alt = '';
            img.width = 1200;
            img.height = 1200;
            img.draggable = false;
            img.className =
                'pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_14px_22px_rgba(74,47,72,0.4)]';
            img.style.zIndex = String(Number(layer.order));
            wrap.appendChild(img);
        });
        stage.appendChild(wrap);

        const layers = wrap.querySelectorAll('img');
        if (reduce) {
            gsap.set(layers, { y: 0, opacity: 1 });
            window.setTimeout(() => {
                if (token === cycleToken) showDish(active + 1);
            }, HOLD_MS);
            return;
        }

        gsap.set(layers, { y: -280, opacity: 0 });
        const tl = gsap.timeline({
            onComplete: () => {
                if (token !== cycleToken) return;
                floatTween = gsap.to(wrap, {
                    y: -12,
                    duration: 1.25,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                });
                window.setTimeout(() => {
                    if (token !== cycleToken) return;
                    gsap.to(wrap, {
                        opacity: 0,
                        y: -28,
                        duration: 0.38,
                        onComplete: () => {
                            if (token === cycleToken) showDish(active + 1);
                        },
                    });
                }, HOLD_MS);
            },
        });
        layers.forEach((img, i) => {
            tl.to(img, { y: 0, opacity: 1, duration: 1.15, ease: 'back.out(1.2)' }, i * STAGGER);
        });
    };

    fetch('/data/dishes.json')
        .then((r) => r.json())
        .then((data) => {
            dishes = Array.isArray(data?.dishes) ? data.dishes : [];
            if (!dishes.length) return;
            showDish(0);
        })
        .catch(() => {
            /* dishes.json missing */
        });
}

function runFooterJuggle() {
    const items = document.querySelectorAll('[data-juggle]');
    if (!items.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lanes = [0.12, 0.34, 0.56, 0.8];
    items.forEach((el, i) => {
        const throwOnce = () => {
            const peak = -(window.innerHeight * (0.18 + Math.random() * 0.12));
            gsap.set(el, { left: `${lanes[i] * 100}%`, bottom: '8%', opacity: 1, y: 0, x: 0 });
            const tl = gsap.timeline({
                onComplete: () => gsap.delayedCall(0.3 + Math.random() * 0.6, throwOnce),
            });
            tl.to(el, {
                y: peak,
                x: gsap.utils.random(-40, 40),
                rotate: gsap.utils.random(-220, 220),
                duration: 0.9 + Math.random() * 0.3,
                ease: 'power2.out',
            }).to(el, {
                y: 0,
                x: 0,
                rotate: gsap.utils.random(180, 400),
                opacity: 0,
                duration: 1.1 + Math.random() * 0.3,
                ease: 'power2.in',
            });
        };
        gsap.delayedCall(i * 0.55, throwOnce);
    });
}

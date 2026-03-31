/* ============================================================
   MAIN.JS — Ratón sin Miedo
   - Hamburger menu mobile/tablet
   - Dropdown Colecciones desktop (hover + click)
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ════════════════════════════════
       HAMBURGER MENU
    ════════════════════════════════ */
    var btn  = document.getElementById('hamburger-btn');
    var menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = menu.classList.toggle('open');
            menu.setAttribute('aria-hidden', !isOpen);
            btn.setAttribute('aria-expanded', isOpen);
            var icon = btn.querySelector('i');
            if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        });

        function closeMobileMenu() {
            menu.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
            btn.setAttribute('aria-expanded', 'false');
            var icon = btn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
            menu.querySelectorAll('.mobile-menu__has-sub').forEach(function (item) {
                item.classList.remove('open');
                var title = item.querySelector('.mobile-menu__sub-title');
                if (title) title.setAttribute('aria-expanded', 'false');
            });
        }

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });

        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        menu.querySelectorAll('.mobile-menu__sub-title').forEach(function (title) {
            title.setAttribute('role', 'button');
            title.setAttribute('tabindex', '0');
            title.setAttribute('aria-expanded', 'false');

            title.addEventListener('click', function () {
                var parent = title.closest('.mobile-menu__has-sub');
                if (!parent) return;
                var isOpen = parent.classList.toggle('open');
                title.setAttribute('aria-expanded', isOpen);
            });

            title.addEventListener('keypress', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    title.click();
                }
            });
        });
    }


    /* ════════════════════════════════
       DROPDOWN COLECCIONES — desktop
       Funciona con hover (CSS) Y con
       click para touch/teclado
    ════════════════════════════════ */
    var dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach(function (dd) {
        var trigger = dd.querySelector('.nav-dropdown__trigger');

        /* Click en desktop: solo abre/cierra el menú,
           NO navega a colecciones.html */
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                /* Solo interceptar en desktop (nav visible) */
                if (window.innerWidth >= 1024) {
                    e.preventDefault();          /* ← bloquea la navegación */
                    var isOpen = dd.classList.toggle('open');
                    /* Cerrar otros dropdowns abiertos */
                    dropdowns.forEach(function (other) {
                        if (other !== dd) other.classList.remove('open');
                    });
                }
            });
        }

        /* Cerrar al hacer click fuera */
        document.addEventListener('click', function (e) {
            if (!dd.contains(e.target)) {
                dd.classList.remove('open');
            }
        });
    });

    /* ═══════════════════════════════════════════════════
       HERO BACKGROUND ROTATOR (auto + botones)
    ═══════════════════════════════════════════════════ */
    var heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        var heroImages = [
            'images/col-otgw.png',
            'images/rock-artedigital.jpg',
            'images/home-banner.jpg',
            'images/Bolso-Hereje-Escaleras.jpg',
            'images/Fotos-bufanda-Frieren-AzulyBlanco-2.jpg'
        ];
        var currentIndex = 0;
        var autoRotateTimer = null;
        var fadeTimer = null;

        function setHeroImage(index) {
            var safeIndex = ((index % heroImages.length) + heroImages.length) % heroImages.length;
            currentIndex = safeIndex;
            heroBg.classList.add('hero__bg--fade');
            if (fadeTimer) clearTimeout(fadeTimer);
            fadeTimer = setTimeout(function () {
                heroBg.style.backgroundImage = 'url("' + heroImages[safeIndex] + '")';
                heroBg.classList.remove('hero__bg--fade');
            }, 220);
        }

        function startAutoRotation() {
            if (autoRotateTimer) clearInterval(autoRotateTimer);
            autoRotateTimer = setInterval(function () {
                setHeroImage(currentIndex + 1);
            }, 6000);
        }

        function resetAutoRotation() {
            startAutoRotation();
        }

        setHeroImage(currentIndex);
        startAutoRotation();

        var arrowButtons = document.querySelectorAll('.hero__arrow[data-hero-dir]');
        arrowButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var dir = btn.getAttribute('data-hero-dir');
                if (dir === 'prev') {
                    setHeroImage(currentIndex - 1);
                } else if (dir === 'next') {
                    setHeroImage(currentIndex + 1);
                }
                resetAutoRotation();
            });
        });
    }

});



/* ════════════════════════════════════════════
   BLOG / TIENDA SLIDERS
   - Loop infinito (clones al inicio y al final)
   - Animación suave con CSS transition + translateX
   - Slide activo siempre centrado
   - Texto cambia instantáneamente
════════════════════════════════════════════ */

(function () {

    /* ── Datos de producto por slider ── */
    var productos = {
        'slider-gatitos': [
            { name: 'Gorra Low Social Battery - Negra',     price: '72.000 $' },
            { name: 'Gorra Low Social Battery - Verde',     price: '72.000 $' },
            { name: 'Bolso Hereje',      price: '135.000 $' },
            { name: 'Bolso Hereje',      price: '135.000 $' },
            { name: 'Bolso Hereje',      price: '135.000 $' }
        ],
        'slider-otgw': [
            { name: 'Camiseta OTGW',             price: '72.000 $' },
            { name: 'Postales OTGW',          price: 'Regalo por tu compra!' },
            { name: 'Sticker Pack OTGW',                 price: 'Regalo por tu compra!' },
            { name: 'Taza OTGW - Morada',             price: '34.000 $' },
            { name: 'Taza OTGW - Blanca',                  price: '34.000 $' }
        ],
        'slider-nadie': [
            { name: 'Camisa Nadie es Ilegal',        price: '85.000 $' },
            { name: 'Camisa Nadie es Ilegal',       price: '85.000 $' },
            { name: 'Camisa Nadie es Ilegal',      price: '85.000 $' },
            { name: 'Camisa Nadie es Ilegal',        price: '85.000 $' },
            { name: 'Camisa Nadie es Ilegal',        price: '85.000 $' }
        ],
        'slider-frieren': [
            { name: 'Bufanda Frieren - Azul',               price: '90.000 $' },
            { name: 'Bufanda Frieren - Blanca',               price: '90.000 $' },
            { name: 'Bufanda Frieren - Azul',              price: '90.000 $' },
            { name: 'Bufanda Frieren - Blanca',              price: '90.000 $' },
            { name: 'Bufanda Frieren',                 price: '90.000 $' }
        ],
        'slider-rocky': [
            { name: 'Buso Rocky Horror',             price: '145.000 $' },
            { name: 'Buso Rocky Horror',          price: '145.000 $' },
            { name: 'Bufanda Rocky Horror',         price: '90.000 $' },
            { name: 'Bufanda Rocky Horror',          price: '90.000 $' },
            { name: 'Combo Rocky Horror',         price: '209.000 $' }
        ]
    };

    document.querySelectorAll('.blog-slider').forEach(function (track) {
        var id        = track.id;
        var prods     = productos[id] || [];
        var origCount = track.children.length;   /* 5 slides reales */

        /* ── 1. Guardar wrap, envolver track en viewport ── */
        var sliderWrap = track.parentNode;
        var viewport   = document.createElement('div');
        viewport.className = 'blog-slider-viewport';
        sliderWrap.insertBefore(viewport, track);
        viewport.appendChild(track);

        /* ── 2. Clonar para loop infinito: [N clones] [N reales] [N clones] ── */
        var origSlides = Array.from(track.children);

        origSlides.forEach(function (s) {                        /* clones al final */
            track.appendChild(s.cloneNode(true));
        });
        for (var i = origSlides.length - 1; i >= 0; i--) {      /* clones al inicio */
            track.insertBefore(origSlides[i].cloneNode(true), track.firstChild);
        }

        var allSlides = Array.from(track.children);  /* 15 slides: 5+5+5 */
        var current   = origCount;                   /* índice del primer slide real */
        var animating = false;
        var currentOffset = 0;                       /* offset acumulado en px */

        /* ── 3. Medir ancho de un slide (incluye su padding) ── */
        function getSlideStep() {
            /* Distancia entre el left de dos slides consecutivos = ancho + gap */
            if (allSlides.length < 2) return allSlides[0].offsetWidth;
            return allSlides[1].getBoundingClientRect().left
                 - allSlides[0].getBoundingClientRect().left;
        }

        /* ── 4. Calcular offset para centrar el slide idx, partiendo de offset=0 ──
           Temporalmente quita el transform para medir desde 0,
           luego lo restaura. Solo se usa en init y en saltos de loop. ── */
        function calcOffsetForIdx(idx) {
            var saved = track.style.transform;
            track.style.transform = 'translateX(0)';
            track.getBoundingClientRect(); /* reflow */

            var vpRect  = viewport.getBoundingClientRect();
            var slRect  = allSlides[idx].getBoundingClientRect();
            var offset  = (vpRect.width / 2) - (slRect.left - vpRect.left) - (slRect.width / 2);

            track.style.transform = saved;
            track.getBoundingClientRect(); /* restore */
            return offset;
        }

        /* ── 5. Aplicar transform ── */
        function applyOffset(offset, animate) {
            track.classList.remove('is-animating');
            track.getBoundingClientRect(); /* reflow */
            if (animate) track.classList.add('is-animating');
            track.style.transform = 'translateX(' + offset + 'px)';
            currentOffset = offset;
        }

        /* ── 6. Actualizar clases y texto ── */
        function updateActiveClass() {
            allSlides.forEach(function (s, i) {
                s.classList.toggle('blog-slide--active', i === current);
            });
        }

        function updateInfo() {
            var realIdx = ((current - origCount) % origCount + origCount) % origCount;
            var prod    = prods[realIdx];
            if (!prod) return;
            var nameEl  = sliderWrap.querySelector('.blog-slider-info__name');
            var priceEl = sliderWrap.querySelector('.blog-slider-info__price');
            if (nameEl)  nameEl.textContent  = prod.name;
            if (priceEl) priceEl.textContent = prod.price;
        }

        /* ── 7. Init: posicionar sin animación ── */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                currentOffset = calcOffsetForIdx(current);
                applyOffset(currentOffset, false);
                updateActiveClass();
                updateInfo();
            });
        });

        /* ── 8. Avanzar/retroceder UN slide ── */
        function goTo(dir) {
            if (animating) return;
            animating = true;

            /* Moverse exactamente el ancho de un slide */
            var step = getSlideStep();
            current += dir;
            currentOffset -= dir * step;

            updateActiveClass();
            updateInfo();
            applyOffset(currentOffset, true);
        }

        /* ── 9. Al terminar la animación: salto silencioso si estamos en clon ── */
        track.addEventListener('transitionend', function (e) {
            if (e.propertyName !== 'transform') return;
            track.classList.remove('is-animating');
            animating = false;

            /* Clones del FINAL alcanzados → saltar a los reales del inicio */
            if (current >= origCount * 2) {
                current  -= origCount;
                currentOffset = calcOffsetForIdx(current);
                applyOffset(currentOffset, false);
            }
            /* Clones del INICIO alcanzados → saltar a los reales del final */
            else if (current < origCount) {
                current  += origCount;
                currentOffset = calcOffsetForIdx(current);
                applyOffset(currentOffset, false);
            }
        });

        /* ── 10. Flechas ── */
        var prevBtn = document.createElement('button');
        prevBtn.className = 'blog-arrow blog-arrow--prev';
        prevBtn.setAttribute('aria-label', 'Anterior');
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

        var nextBtn = document.createElement('button');
        nextBtn.className = 'blog-arrow blog-arrow--next';
        nextBtn.setAttribute('aria-label', 'Siguiente');
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        sliderWrap.appendChild(prevBtn);
        sliderWrap.appendChild(nextBtn);

        prevBtn.addEventListener('click', function () { goTo(-1); });
        nextBtn.addEventListener('click', function () { goTo(+1); });

        /* ── 11. Recalcular al resize ── */
        window.addEventListener('resize', function () {
            currentOffset = calcOffsetForIdx(current);
            applyOffset(currentOffset, false);
        });
    });

}());

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const onScroll = () => {
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox?.querySelector('.lightbox-image');
    const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
    const btnClose = lightbox?.querySelector('.lightbox-close');
    const btnPrev = lightbox?.querySelector('.lightbox-prev');
    const btnNext = lightbox?.querySelector('.lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        if (!galleryItems.length || !lightboxImg) return;
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        const img = galleryItems[currentIndex].querySelector('img');
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
        }
    };

    const openLightbox = (index) => {
        if (!lightbox) return;
        showImage(index);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.hidden = true;
        document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    btnClose?.addEventListener('click', closeLightbox);
    btnPrev?.addEventListener('click', () => showImage(currentIndex - 1));
    btnNext?.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox?.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!lightbox || lightbox.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
});

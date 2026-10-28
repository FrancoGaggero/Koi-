// Motion de la página con GSAP: entradas al hacer scroll, título letra por letra, parallax,
// tarjetas que se inclinan con el mouse, botones "magnéticos" y koi que cruzan nadando.
// Con "reducir movimiento" no hace nada (y CSS deja todo visible).

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const conMovimiento = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const conMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Videos: se cargan recién cerca de la pantalla
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-video-diferido]');
const obsVideo = new IntersectionObserver(
	(entradas) =>
		entradas.forEach((e) => {
			const v = e.target as HTMLVideoElement;
			if (e.isIntersecting) {
				if (v.preload === 'none') {
					v.preload = 'auto';
					v.load();
				}
				if (conMovimiento) v.play().catch(() => {});
			} else v.pause();
		}),
	{ rootMargin: '150px' },
);
videos.forEach((v) => obsVideo.observe(v));

if (conMovimiento) {
	gsap.registerPlugin(ScrollTrigger);

	// Título del hero: cada letra cae y rebota
	gsap.from('[data-letra]', {
		y: -90,
		rotate: () => gsap.utils.random(-25, 25),
		opacity: 0,
		duration: 0.9,
		ease: 'bounce.out',
		stagger: 0.035,
		delay: 0.15,
	});

	// Entradas: lo marcado con data-entra sube y aparece, escalonado por sección
	gsap.utils.toArray<HTMLElement>('section, footer').forEach((seccion) => {
		const items = seccion.querySelectorAll('[data-entra]');
		if (!items.length) return;
		gsap.fromTo(
			items,
			{ y: 50, opacity: 0, scale: 0.96 },
			{
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 0.8,
				ease: 'back.out(1.6)',
				stagger: 0.12,
				scrollTrigger: { trigger: seccion, start: 'top 78%' },
			},
		);
	});

	// Parallax: data-parallax = cuánto se mueve respecto del scroll (negativo, hacia arriba)
	gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
		const k = parseFloat(el.dataset.parallax ?? '0');
		gsap.to(el, {
			y: () => k * window.innerHeight,
			ease: 'none',
			scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
		});
	});

	// Koi que cruzan nadando de un lado al otro, con un leve vaivén
	gsap.utils.toArray<HTMLElement>('[data-koi-nada]').forEach((koi, i) => {
		const inverso = koi.hasAttribute('data-koi-inverso');
		const ancho = () => (koi.parentElement?.clientWidth ?? innerWidth) + koi.clientWidth * 2;
		gsap.set(koi, { scaleX: inverso ? -1 : 1 });
		gsap.fromTo(
			koi,
			{ x: () => (inverso ? ancho() - koi.clientWidth : -koi.clientWidth) },
			{
				x: () => (inverso ? -koi.clientWidth * 1.2 : ancho()),
				duration: 26 + i * 5,
				ease: 'none',
				repeat: -1,
				delay: i * 4,
			},
		);
		gsap.to(koi, { y: '+=28', rotate: inverso ? 6 : -6, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
	});

	if (conMouse) {
		// Tarjetas que se inclinan hacia el mouse
		document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
			gsap.set(card, { transformPerspective: 900 });
			const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
			const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
			card.addEventListener('pointermove', (e) => {
				const r = card.getBoundingClientRect();
				ry(((e.clientX - r.left) / r.width - 0.5) * 10);
				rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
			});
			card.addEventListener('pointerleave', () => {
				rx(0);
				ry(0);
			});
		});

		// Botones que se acercan un poco al mouse
		document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((b) => {
			const x = gsap.quickTo(b, 'x', { duration: 0.4, ease: 'power3' });
			const y = gsap.quickTo(b, 'y', { duration: 0.4, ease: 'power3' });
			b.addEventListener('pointermove', (e) => {
				const r = b.getBoundingClientRect();
				x((e.clientX - r.left - r.width / 2) * 0.25);
				y((e.clientY - r.top - r.height / 2) * 0.35);
			});
			b.addEventListener('pointerleave', () => {
				x(0);
				y(0);
			});
		});
	}
}

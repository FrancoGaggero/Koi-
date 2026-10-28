// Carga el planeta 3D (y three.js) recién cuando el hero está a la vista. Sin WebGL o con
// "reducir movimiento" no carga nada y queda el koi de respaldo.

const contenedor = document.getElementById('planeta');

function hayWebGL() {
	try {
		const c = document.createElement('canvas');
		return !!(c.getContext('webgl2') || c.getContext('webgl'));
	} catch {
		return false;
	}
}

if (contenedor && hayWebGL() && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
	const obs = new IntersectionObserver(
		async (entradas) => {
			if (!entradas.some((e) => e.isIntersecting)) return;
			obs.disconnect();
			const { crearPlaneta } = await import('./planeta');
			const sprites = JSON.parse(contenedor.dataset.sprites ?? '[]');
			await crearPlaneta(contenedor, sprites);
			contenedor.querySelector<HTMLElement>('.planeta-respaldo')?.style.setProperty('opacity', '0');
			document.querySelector<HTMLElement>('.planeta-pista')?.style.setProperty('opacity', '1');
		},
		{ rootMargin: '200px' },
	);
	obs.observe(contenedor);
}

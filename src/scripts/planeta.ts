// Planeta-estanque 3D del hero: una esfera de agua estilo dibujo animado, con nenúfares, koi
// que nadan alrededor y dos anillos de íconos (las apps, los Capis, instrumentos y juguetes) en
// órbita. Gira solo; se arrastra con el mouse o el dedo, con inercia.

import * as THREE from 'three';

type Sprite = { nombre: string; src: string };

const TINTA = 0x1e2a4a;
const RADIO = 1.75;
const AUTO = 0.18;                  // giro automático (rad/s)
const ROCE = 2.6;                   // cuánto frena la inercia después de soltar
const ANILLO_A = ['app-music', 'capi-director', 'piano', 'tambor', 'guitarra', 'app-learn', 'capi-aviador', 'trompeta', 'xilofono', 'maracas'];
const GRANDES = new Set(['app-music', 'app-learn', 'capi-director', 'capi-aviador']);

// Koi visto desde arriba (el mismo dibujo que KoiSvg.astro), mirando a +x
const koiSvg = (manchas: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 110" width="440" height="220">
<g stroke="#1e2a4a" stroke-width="4" stroke-linejoin="round">
<path d="M52 55 C34 34 14 26 4 30 C16 44 18 50 12 55 C18 60 16 66 4 80 C14 84 34 76 52 55 Z" fill="#ffd9c4"/>
<path d="M112 34 C104 14 88 8 78 12 C86 22 92 30 96 40 Z" fill="#ffd9c4"/>
<path d="M112 76 C104 96 88 102 78 98 C86 88 92 80 96 70 Z" fill="#ffd9c4"/>
<path d="M48 55 C70 26 132 22 178 34 C206 41 214 50 214 55 C214 60 206 69 178 76 C132 88 70 84 48 55 Z" fill="#fffdf6"/>
</g>
<path d="M120 30 C138 26 160 30 168 40 C158 50 132 48 120 40 Z" fill="${manchas}"/>
<path d="M86 60 C100 54 118 58 124 70 C112 78 94 76 86 70 Z" fill="${manchas}"/>
<path d="M178 38 C192 40 202 46 206 52 C196 54 184 50 178 44 Z" fill="${manchas}"/>
<circle cx="196" cy="45" r="4" fill="#1e2a4a"/><circle cx="196" cy="65" r="4" fill="#1e2a4a"/>
</svg>`;

function texturaDeSvg(svg: string): Promise<THREE.Texture> {
	return new Promise((ok, mal) => {
		const img = new Image();
		img.onload = () => {
			const c = document.createElement('canvas');
			c.width = img.width;
			c.height = img.height;
			c.getContext('2d')!.drawImage(img, 0, 0);
			const tex = new THREE.CanvasTexture(c);
			tex.colorSpace = THREE.SRGBColorSpace;
			ok(tex);
		};
		img.onerror = mal;
		img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
	});
}

// Agua: tonos por bandas (toon), ondas que se mueven y un brillo en el borde
const aguaVertex = /* glsl */ `
	varying vec3 vNormalVista;
	varying vec3 vPos;
	void main() {
		vPos = position;
		vNormalVista = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;
const aguaFragment = /* glsl */ `
	uniform float uTiempo;
	varying vec3 vNormalVista;
	varying vec3 vPos;
	void main() {
		vec3 n = normalize(vNormalVista);
		float luz = dot(n, normalize(vec3(-0.45, 0.6, 0.75)));
		vec3 hondo = vec3(0.04, 0.42, 0.47);
		vec3 medio = vec3(0.07, 0.71, 0.67);
		vec3 claro = vec3(0.45, 0.89, 0.83);
		vec3 color = luz > 0.55 ? claro : (luz > 0.05 ? medio : hondo);
		// ondas: líneas claras que se desplazan sobre la superficie
		vec3 p = normalize(vPos) * 3.0;
		float onda = sin(p.x * 3.1 + uTiempo * 1.1) + sin(p.z * 2.7 - uTiempo * 0.9) + sin(p.y * 3.6 + uTiempo * 0.7);
		float linea = smoothstep(0.12, 0.0, abs(onda - 0.9));
		color = mix(color, vec3(0.86, 1.0, 0.97), linea * 0.55 * step(0.0, luz + 0.3));
		// brillo de borde
		float borde = pow(1.0 - max(n.z, 0.0), 2.6);
		color += vec3(0.6, 1.0, 0.95) * borde * 0.35;
		gl_FragColor = vec4(color, 1.0);
		#include <colorspace_fragment>
	}
`;

export async function crearPlaneta(contenedor: HTMLElement, sprites: Sprite[]) {
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .8s';
	contenedor.appendChild(renderer.domElement);

	const escena = new THREE.Scene();
	const camara = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
	camara.position.set(0, 0.4, 10.2);
	camara.lookAt(0, 0, 0);

	escena.add(new THREE.AmbientLight(0xffffff, 1.6));
	const sol = new THREE.DirectionalLight(0xfff1d0, 2.2);
	sol.position.set(-4, 5, 6);
	escena.add(sol);

	// Todo lo que se arrastra va en 'mundo'
	const mundo = new THREE.Group();
	mundo.rotation.x = 0.25;
	escena.add(mundo);

	// Planeta con contorno de tinta (la cara de atrás de una esfera apenas más grande)
	const geo = new THREE.SphereGeometry(RADIO, 64, 48);
	const agua = new THREE.ShaderMaterial({ uniforms: { uTiempo: { value: 0 } }, vertexShader: aguaVertex, fragmentShader: aguaFragment });
	mundo.add(new THREE.Mesh(geo, agua));
	const contorno = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: TINTA, side: THREE.BackSide }));
	contorno.scale.setScalar(1.035);
	mundo.add(contorno);

	// Apoya un objeto plano sobre la superficie, mirando hacia afuera
	const sobreSuperficie = (obj: THREE.Object3D, dir: THREE.Vector3, alto: number) => {
		obj.position.copy(dir).multiplyScalar(RADIO + alto);
		obj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
	};

	// Nenúfares (algunos con flor)
	const hoja = new THREE.MeshToonMaterial({ color: 0x4fbf6a });
	const borde = new THREE.MeshBasicMaterial({ color: TINTA });
	const flor = new THREE.MeshToonMaterial({ color: 0xff8fb1 });
	const direcciones = [
		[0.3, 0.8, 0.5], [-0.7, 0.3, 0.6], [0.8, -0.2, 0.55], [-0.2, -0.7, 0.7], [0.1, 0.2, -1], [-0.8, 0.5, -0.4], [0.6, 0.6, -0.5],
	];
	direcciones.forEach(([x, y, z], i) => {
		const dir = new THREE.Vector3(x, y, z).normalize();
		const g = new THREE.Group();
		const r = 0.26 + (i % 3) * 0.06;
		const hojaGeo = new THREE.CircleGeometry(r, 28, 0.35, Math.PI * 2 - 0.7);
		const fondo = new THREE.Mesh(new THREE.CircleGeometry(r + 0.035, 28, 0.32, Math.PI * 2 - 0.64), borde);
		const frente = new THREE.Mesh(hojaGeo, hoja);
		frente.position.z = 0.004;
		g.add(fondo, frente);
		if (i % 2 === 0) {
			const f = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), flor);
			f.position.set(-r * 0.3, r * 0.2, 0.05);
			g.add(f);
		}
		g.rotation.z = i;
		const soporte = new THREE.Group();
		soporte.add(g);
		sobreSuperficie(soporte, dir, 0.01);
		mundo.add(soporte);
	});

	// Koi que nadan alrededor, rozando la superficie
	const koiTex = await Promise.all(['#ff5a36', '#ffc83d', '#ff5a36'].map((c) => texturaDeSvg(koiSvg(c))));
	const kois = koiTex.map((tex, i) => {
		const malla = new THREE.Mesh(
			new THREE.PlaneGeometry(0.95, 0.475),
			new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
		);
		const soporte = new THREE.Group();
		soporte.add(malla);
		mundo.add(soporte);
		const eje = new THREE.Vector3(Math.sin(i * 2.1), 1.2, Math.cos(i * 1.7)).normalize();
		const base = new THREE.Vector3(1, 0, 0).cross(eje).normalize();
		return { soporte, malla, eje, base, vel: 0.38 + i * 0.07, fase: i * 2.2 };
	});

	// Anillos de íconos: el A con las apps, los Capis e instrumentos; el B con juguetes
	const cargador = new THREE.TextureLoader();
	const texturas = await Promise.all(
		sprites.map(async (s) => {
			const tex = await cargador.loadAsync(s.src);
			tex.colorSpace = THREE.SRGBColorSpace;
			return { ...s, tex };
		}),
	);
	const anilloA = new THREE.Group();
	const anilloB = new THREE.Group();
	anilloA.rotation.set(0.42, 0, 0.12);
	anilloB.rotation.set(-0.35, 0, -0.45);
	mundo.add(anilloA, anilloB);

	const lineaAnillo = (radio: number) => {
		const m = new THREE.Mesh(new THREE.TorusGeometry(radio, 0.012, 6, 120), new THREE.MeshBasicMaterial({ color: TINTA, transparent: true, opacity: 0.35 }));
		m.rotation.x = Math.PI / 2;
		return m;
	};
	anilloA.add(lineaAnillo(2.55));
	anilloB.add(lineaAnillo(2.9));

	const enA = texturas.filter((t) => ANILLO_A.includes(t.nombre)).sort((a, b) => ANILLO_A.indexOf(a.nombre) - ANILLO_A.indexOf(b.nombre));
	const enB = texturas.filter((t) => !ANILLO_A.includes(t.nombre));
	const iconos: THREE.Sprite[] = [];
	const repartir = (lista: typeof texturas, anillo: THREE.Group, radio: number) =>
		lista.forEach((t, i) => {
			const img = t.tex.image as HTMLImageElement;
			const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.tex, transparent: true }));
			const alto = GRANDES.has(t.nombre) ? 0.78 : 0.52;
			sp.scale.set((alto * img.width) / img.height, alto, 1);
			const a = (i / lista.length) * Math.PI * 2;
			sp.position.set(Math.cos(a) * radio, 0, Math.sin(a) * radio);
			sp.userData = { escala: sp.scale.clone(), fase: i * 0.9 };
			anillo.add(sp);
			iconos.push(sp);
		});
	repartir(enA, anilloA, 2.55);
	repartir(enB, anilloB, 2.9);

	// --- Arrastre con inercia ---
	let velY = AUTO;
	let velX = 0;
	let arrastrando = false;
	let ultimo = { x: 0, y: 0, t: 0 };
	const lienzo = renderer.domElement;
	contenedor.addEventListener('pointerdown', (e) => {
		arrastrando = true;
		ultimo = { x: e.clientX, y: e.clientY, t: performance.now() };
		contenedor.setPointerCapture(e.pointerId);
	});
	contenedor.addEventListener('pointermove', (e) => {
		if (arrastrando) {
			const ahora = performance.now();
			const dt = Math.max((ahora - ultimo.t) / 1000, 0.001);
			const dx = (e.clientX - ultimo.x) / contenedor.clientWidth;
			const dy = (e.clientY - ultimo.y) / contenedor.clientHeight;
			mundo.rotation.y += dx * 4;
			mundo.rotation.x = THREE.MathUtils.clamp(mundo.rotation.x + dy * 3, -0.9, 0.9);
			velY = (dx * 4) / dt;
			velX = (dy * 3) / dt;
			ultimo = { x: e.clientX, y: e.clientY, t: ahora };
		}
		apuntar(e);
	});
	const soltar = () => (arrastrando = false);
	contenedor.addEventListener('pointerup', soltar);
	contenedor.addEventListener('pointercancel', soltar);
	contenedor.addEventListener('pointerleave', () => (sobre = null));

	// Íconos que crecen al pasar el mouse
	const rayo = new THREE.Raycaster();
	const puntero = new THREE.Vector2();
	let sobre: THREE.Sprite | null = null;
	function apuntar(e: PointerEvent) {
		const r = lienzo.getBoundingClientRect();
		puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
		rayo.setFromCamera(puntero, camara);
		sobre = (rayo.intersectObjects(iconos)[0]?.object as THREE.Sprite) ?? null;
	}

	// --- Tamaño y pausa cuando no se ve ---
	const ajustar = () => {
		const w = contenedor.clientWidth;
		const h = contenedor.clientHeight;
		renderer.setSize(w, h, false);
		camara.aspect = w / h;
		camara.updateProjectionMatrix();
	};
	new ResizeObserver(ajustar).observe(contenedor);
	ajustar();

	let visible = true;
	new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(contenedor);

	const reloj = new THREE.Timer();
	const tmp = new THREE.Vector3();
	const normal = new THREE.Vector3();
	const tangente = new THREE.Vector3();
	const m = new THREE.Matrix4();

	renderer.setAnimationLoop((ms) => {
		reloj.update(ms);
		const dt = Math.min(reloj.getDelta(), 0.05);
		if (!visible || document.hidden) return;
		const t = reloj.getElapsed();

		if (!arrastrando) {
			// la inercia se frena y vuelve al giro automático
			const f = Math.exp(-ROCE * dt);
			velY = AUTO + (velY - AUTO) * f;
			velX *= f;
			mundo.rotation.y += velY * dt;
			mundo.rotation.x = THREE.MathUtils.clamp(mundo.rotation.x + velX * dt, -0.9, 0.9);
			mundo.rotation.x += (0.25 - mundo.rotation.x) * dt * 0.4;
		}

		agua.uniforms.uTiempo.value = t;
		anilloA.rotation.y = t * 0.16;
		anilloB.rotation.y = -t * 0.12;

		for (const k of kois) {
			const ang = t * k.vel + k.fase;
			normal.copy(k.base).applyAxisAngle(k.eje, ang).normalize();
			tangente.copy(k.eje).cross(normal).normalize();
			tmp.crossVectors(normal, tangente);
			m.makeBasis(tangente, tmp, normal);
			k.soporte.quaternion.setFromRotationMatrix(m);
			k.soporte.position.copy(normal).multiplyScalar(RADIO + 0.03);
			k.malla.rotation.z = Math.sin(t * 7 + k.fase) * 0.12;   // coletazo
		}

		for (const sp of iconos) {
			const { escala, fase } = sp.userData as { escala: THREE.Vector3; fase: number };
			const meta = sp === sobre ? 1.35 : 1 + Math.sin(t * 2 + fase) * 0.04;
			const actual = sp.scale.y / escala.y;
			const s = actual + (meta - actual) * Math.min(dt * 10, 1);
			sp.scale.set(escala.x * s, escala.y * s, 1);
		}

		renderer.render(escena, camara);
	});

	requestAnimationFrame(() => (lienzo.style.opacity = '1'));
}

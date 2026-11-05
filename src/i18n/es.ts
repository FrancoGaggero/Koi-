// Textos de la web en español (el inglés, en en.ts, tiene las mismas claves)

const es = {
	meta: {
		titulo: 'Koi Educational Games · Juegos para aprender jugando',
		descripcion:
			'Estudio independiente de juegos educativos para chicos de 2 a 7 años: Capybara Music & Sounds, Capibara Learn & Play, Chameleon Draw & Paint y Cow Farm & Garden.',
	},
	nav: { apps: 'Apps', proximamente: 'Próximamente', nosotros: 'Nosotros', contacto: 'Contacto', idioma: 'EN', idiomaNombre: 'English' },
	hero: {
		chip: 'Estudio de juegos educativos',
		titulo1: 'Jugar es la mejor',
		titulo2: 'forma de aprender',
		texto:
			'Hacemos juegos para chicos de 2 a 7 años con música, colores, números, dibujo y animales de la granja. Sin textos que leer: se juega tocando, escuchando y descubriendo.',
		verApps: 'Ver las apps',
		perfilPlay: 'Nuestro perfil en Google Play',
		arrastra: 'Arrastrá el planeta',
	},
	apps: {
		chip: 'Nuestras apps',
		titulo: 'Cuatro mundos para explorar',
		disponible: 'Disponible en Google Play',
		muyPronto: 'Muy pronto en Google Play',
		privacidad: 'Política de privacidad',
		juegos: 'Algunos de sus juegos',
		music: {
			nombre: 'Capybara Music & Sounds',
			lema: 'Un mundo musical con Capi, el capibara director de orquesta.',
			texto:
				'22 juegos para escuchar, tocar y crear música: piano, batería, guitarra eléctrica, una consola de DJ, una banda de rock, un coro de capibaras y mucho más.',
			chips: ['22 juegos', 'Instrumentos reales', 'Sin conexión', '6 idiomas'],
		},
		learn: {
			nombre: 'Capibara Learn & Play',
			lema: 'Aprender jugando con Capi, el capibara de anteojos de sol.',
			texto:
				'Más de 25 juegos de números, formas, colores, memoria, rompecabezas, dibujo y música, para que los más chicos practiquen a su ritmo.',
			chips: ['+25 juegos', 'Números y formas', 'Dibujo y pintura', '6 idiomas'],
		},
		draw: {
			nombre: 'Chameleon Draw & Paint',
			lema: 'Un taller de arte con Chamy, el camaleón que cambia de color con cada pintura.',
			texto:
				'20 juegos para dibujar, colorear y crear: estudio libre con crayones, acuarela y brillitos, luces de neón, fuegos de pintura, stickers, unir los puntos, mezclas de colores y mucho más.',
			chips: ['20 juegos', 'Dibujo y pintura', 'Colores y mezclas', '6 idiomas'],
		},
		farm: {
			nombre: 'Cow Farm & Garden',
			lema: 'Una granja llena de juegos con Lola, la vaquita granjera.',
			texto:
				'30 juegos para sembrar, cuidar a los animales, pintar y contar: bañar al cerdito, juntar huevos, decorar a Lola, globos de animales, abejas y flores, una granja para explorar de día y de noche, y mucho más. La dificultad sube sola a medida que juegan.',
			chips: ['30 juegos', 'Desde 2 años', 'Animales y huerta', '6 idiomas'],
		},
	},
	proximas: {
		chip: 'Próximamente',
		titulo: 'Lo que viene',
		texto: 'Estamos preparando nuevas aventuras. ¿Te animás a adivinar quién aparece?',
		tarjeta: 'Muy pronto',
		pista: ['Algo nada por acá…', 'Se escucha un ritmo…', 'Huele a aventura…'],
	},
	nosotros: {
		chip: 'Nosotros',
		titulo: 'Cómo hacemos nuestros juegos',
		texto:
			'Koi Educational Games es un estudio independiente. Diseñamos cada juego pensando en cómo juegan de verdad los más chicos y en la tranquilidad de sus familias.',
		promesas: [
			{ titulo: 'Para 2 a 7 años', texto: 'Botones grandes, reglas simples y premios que motivan sin frustrar.' },
			{ titulo: 'Sin textos', texto: 'Se juega con imágenes y sonidos, incluso antes de saber leer.' },
			{ titulo: 'Control para adultos', texto: 'Las compras y los links pasan por un control que solo resuelve un adulto.' },
			{ titulo: 'En 6 idiomas', texto: 'Español, inglés, portugués, alemán, chino e hindi.' },
		],
	},
	contacto: {
		titulo: '¿Hablamos?',
		texto: 'Si sos familia, docente o te gustaría sumarte a un proyecto, escribinos.',
		escribinos: 'Escribinos',
		verPlay: 'Ver en Google Play',
		instagram: 'Seguinos en Instagram',
	},
	footer: { derechos: 'Todos los derechos reservados.', hecho: 'Hecho con cariño y muchos capibaras.' },
};

export default es;
export type Textos = typeof es;

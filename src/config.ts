// Datos del estudio que se repiten en toda la web

export const ESTUDIO = 'Koi Educational Games';

// Mail de contacto (con null no se muestra el botón)
export const MAIL_CONTACTO: string | null = 'francogaggero@krowdsupply.com';

// Página de desarrollador en Google Play (Play la arma con el nombre exacto del desarrollador)
export const INSTAGRAM = 'https://www.instagram.com/koi.gamingstudio/';

export const PLAY_DESARROLLADOR = 'https://play.google.com/store/apps/developer?id=Koi+Educational+Games';

export const APPS = {
	music: {
		paquete: 'com.krowdsupply.capibaraMusicSounds',
		// false hasta que salga a producción: el botón dice "Muy pronto en Google Play"
		publicada: false,
		privacidad: 'https://francogaggero-creator.github.io/privacy/capibara-music.html',
	},
	learn: {
		paquete: 'com.krowdsupply.capibaraLearnPlay',
		publicada: true,
		privacidad: 'https://francogaggero-creator.github.io/privacy/',
	},
} as const;

export const linkPlay = (paquete: string) => `https://play.google.com/store/apps/details?id=${paquete}`;

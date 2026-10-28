import es from './es';
import en from './en';

export type Lang = 'es' | 'en';

const textos = { es, en };

/** Textos de la web en el idioma 'lang' */
export const t = (lang: Lang) => textos[lang];

/** Ruta de la portada en cada idioma (español sin prefijo) */
export const rutaInicio = (lang: Lang) => (lang === 'es' ? '/' : '/en/');

export const otroIdioma = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

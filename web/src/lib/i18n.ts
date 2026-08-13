export const locales = ["en", "fa", "de", "fr", "nl", "es", "ar", "tr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDetails: Record<
  Locale,
  { label: string; direction: "ltr" | "rtl"; htmlLang: string }
> = {
  en: { label: "English", direction: "ltr", htmlLang: "en" },
  fa: { label: "فارسی", direction: "rtl", htmlLang: "fa" },
  de: { label: "Deutsch", direction: "ltr", htmlLang: "de" },
  fr: { label: "Français", direction: "ltr", htmlLang: "fr" },
  nl: { label: "Nederlands", direction: "ltr", htmlLang: "nl" },
  es: { label: "Español", direction: "ltr", htmlLang: "es" },
  ar: { label: "العربية", direction: "rtl", htmlLang: "ar" },
  tr: { label: "Türkçe", direction: "ltr", htmlLang: "tr" },
};

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function replacePathLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;

  if (hasLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);

  return `/${segments.join("/")}`;
}

export function alternateLanguages(pathWithoutLocale = "") {
  const suffix = pathWithoutLocale ? `/${pathWithoutLocale.replace(/^\//, "")}` : "";
  return Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}${suffix}`]),
  );
}

# Localization

The canonical locale is English and the first render uses the dark theme. Locale-prefixed
routes make each translation addressable and indexable:

```text
/en  /fa  /de  /fr  /nl  /es  /ar  /tr
```

Persian and Arabic render right-to-left. File names, source-code fragments, email addresses,
and URLs retain left-to-right direction inside those documents.

Translation dictionaries are strongly typed against the English dictionary. Adding a locale
therefore requires every navigation, command, status, metadata, and content key to be handled
at compile time. Locale switching preserves the current page rather than returning visitors
to the home route.

When adding a language:

1. Add it to the supported-locale registry, including its native display name and direction.
2. Add a complete dictionary with the same shape as English.
3. Add it to `generateStaticParams`, metadata alternates, and the sitemap.
4. Test menu expansion, mobile layout, date/number formatting, and keyboard navigation.
5. Have a native speaker review professional terminology before production release.

Machine-assisted translations in this repository are a usable baseline, but professional
review is recommended for résumé publication in each target market.


export const CASE_LABELS: Record<string, Record<string, string>> = {
    nominative: { ja: "主格", en: "Nominative" },
    accusative: { ja: "対格", en: "Accusative" },
    dative: { ja: "与格", en: "Dative" },
    genitive: { ja: "属格", en: "Genitive" },
};

export function getCaseLabel(key: string, locale: string = "ja"): string {
    return CASE_LABELS[key]?.[locale] ?? key;
} 
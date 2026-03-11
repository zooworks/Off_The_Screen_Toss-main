import { Language } from '@/constants/translations';

/**
 * Returns the localized text based on user's language preference.
 * Falls back to Korean if English is not available.
 */
export function getLocalizedText(
    ko: string | null | undefined,
    en: string | null | undefined,
    language: Language
): string {
    if (language === 'en' && en) {
        return en;
    }
    return ko || '';
}

/**
 * Helper to get localized content fields
 */
export function getLocalizedContent<T extends {
    title?: string;
    titleEn?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
}>(
    content: T,
    language: Language
): { title: string; description: string } {
    return {
        title: getLocalizedText(content.title, content.titleEn, language),
        description: getLocalizedText(content.description, content.descriptionEn, language),
    };
}

/**
 * Helper to get localized location fields
 */
export function getLocalizedLocation<T extends {
    name?: string;
    nameEn?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    address?: string;
    addressEn?: string | null;
    displayAddress?: string | null;
    displayAddressEn?: string | null;
    ownerDescription?: string | null;
    ownerDescriptionEn?: string | null;
    onScreen?: string | null;
    onScreenEn?: string | null;
    parking?: string | null;
    parkingEn?: string | null;
}>(
    location: T,
    language: Language
): { name: string; description: string; address: string; displayAddress: string; ownerDescription: string; onScreen: string; parking: string } {
    return {
        name: getLocalizedText(location.name, location.nameEn, language),
        description: getLocalizedText(location.description, location.descriptionEn, language),
        address: getLocalizedText(location.address, location.addressEn, language),
        displayAddress: getLocalizedText(location.displayAddress, location.displayAddressEn, language),
        ownerDescription: getLocalizedText(location.ownerDescription, location.ownerDescriptionEn, language),
        onScreen: getLocalizedText(location.onScreen, location.onScreenEn, language),
        parking: getLocalizedText(location.parking, location.parkingEn, language),
    };
}

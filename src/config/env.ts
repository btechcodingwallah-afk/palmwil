// PamWill Environment Configuration & App Download Helpers

export interface CompanyInfo {
  name: string;
  tagline: string;
  email: string;
  supportEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  operatingHours: string;
  cin: string;
}

export interface AppDownloadConfig {
  patient: {
    apkUrl: string;
    playStoreUrl: string;
    appStoreUrl: string;
    fileName: string;
  };
  therapist: {
    apkUrl: string;
    playStoreUrl: string;
    appStoreUrl: string;
    fileName: string;
  };
}

export const COMPANY_INFO: CompanyInfo = {
  name: import.meta.env.VITE_COMPANY_NAME || "PamWill Wellness Marketplace Pvt. Ltd.",
  tagline: import.meta.env.VITE_COMPANY_TAGLINE || "Luxury On-Demand Spa & Wellness Therapy",
  email: import.meta.env.VITE_COMPANY_EMAIL || "contact@pamwill.com",
  supportEmail: import.meta.env.VITE_COMPANY_SUPPORT_EMAIL || "support@pamwill.com",
  phone: import.meta.env.VITE_COMPANY_PHONE || "+91 98765 43210",
  whatsapp: import.meta.env.VITE_COMPANY_WHATSAPP || "+91 98765 43210",
  address: import.meta.env.VITE_COMPANY_ADDRESS || "PamWill Wellness Sanctuary, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India",
  operatingHours: import.meta.env.VITE_COMPANY_OPERATING_HOURS || "Monday – Sunday: 7:00 AM – 11:00 PM IST",
  cin: import.meta.env.VITE_COMPANY_CIN || "U74999KA2024PTC189021",
};

export const CONNECT_WITH_US_FORM_URL =
  import.meta.env.VITE_CONNECT_WITH_US_FORM_URL || "https://forms.google.com";

export const APP_DOWNLOADS: AppDownloadConfig = {
  patient: {
    apkUrl: import.meta.env.VITE_PATIENT_APK_URL || "/apks/pamwill-client.apk",
    playStoreUrl: import.meta.env.VITE_PATIENT_PLAYSTORE_URL || "",
    appStoreUrl: import.meta.env.VITE_PATIENT_APPSTORE_URL || "",
    fileName: "pamwill-client.apk",
  },
  therapist: {
    apkUrl: import.meta.env.VITE_THERAPIST_APK_URL || "/apks/palwill-therapist.apk",
    playStoreUrl: import.meta.env.VITE_THERAPIST_PLAYSTORE_URL || "",
    appStoreUrl: import.meta.env.VITE_THERAPIST_APPSTORE_URL || "",
    fileName: "palwill-therapist.apk",
  },
};

export const SOCIAL_LINKS = {
  instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM || "https://instagram.com/pamwill_wellness",
  linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN || "https://linkedin.com/company/pamwill",
  twitter: import.meta.env.VITE_SOCIAL_TWITTER || "https://twitter.com/pamwillwellness",
};

/**
 * Resolves the download link and determines whether it's an APK demo download or official store URL.
 */
export function getAppDownloadDetails(
  userType: 'patient' | 'therapist',
  store: 'playstore' | 'appstore'
): { url: string; isApkFallback: boolean; fileName: string; storeName: string } {
  const config = APP_DOWNLOADS[userType];
  const directStoreUrl = store === 'playstore' ? config.playStoreUrl : config.appStoreUrl;
  const storeName = store === 'playstore' ? 'Google Play Store' : 'Apple App Store';

  if (directStoreUrl && directStoreUrl.trim().length > 0) {
    return {
      url: directStoreUrl,
      isApkFallback: false,
      fileName: config.fileName,
      storeName,
    };
  }

  // Fallback to demo APK file
  return {
    url: config.apkUrl,
    isApkFallback: true,
    fileName: config.fileName,
    storeName,
  };
}

/**
 * Triggers either store redirect or direct APK file download.
 */
export function triggerAppDownload(
  userType: 'patient' | 'therapist',
  store: 'playstore' | 'appstore',
  onNotification?: (msg: string) => void
) {
  const details = getAppDownloadDetails(userType, store);
  const appLabel = userType === 'patient' ? 'PamWill Patient & Client App' : 'PamWill Therapist Partner App';

  if (!details.isApkFallback) {
    window.open(details.url, '_blank', 'noopener,noreferrer');
    if (onNotification) {
      onNotification(`Redirecting to ${details.storeName}...`);
    }
    return details;
  }

  // Programmatically trigger direct APK download
  const link = document.createElement('a');
  link.href = details.url;
  link.download = details.fileName;
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (onNotification) {
    onNotification(
      `Downloading demo package (${details.fileName}) for ${appLabel}. Official ${details.storeName} live link will connect upon store release.`
    );
  }

  return details;
}

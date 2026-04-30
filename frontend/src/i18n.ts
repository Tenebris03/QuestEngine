import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Component namespaces
import HeaderEn from './components/Header/locales/en/translation.json';
import HeaderDe from './components/Header/locales/de/translation.json';
import FooterEn from './components/Footer/locales/en/translation.json';
import FooterDe from './components/Footer/locales/de/translation.json';
import HomeEn from './pages/Home/locales/en/translation.json';
import HomeDe from './pages/Home/locales/de/translation.json';
import DashboardEn from './pages/Dashboard/locales/en/translation.json';
import DashboardDe from './pages/Dashboard/locales/de/translation.json';
import AuthEn from './pages/Auth/locales/en/translation.json';
import AuthDe from './pages/Auth/locales/de/translation.json';
import SettingsEn from './pages/Settings/locales/en/translation.json';
import SettingsDe from './pages/Settings/locales/de/translation.json';
import QuestGeneratorEn from './pages/QuestGenerator/locales/en/translation.json';
import QuestGeneratorDe from './pages/QuestGenerator/locales/de/translation.json';
import PreferenceFormEn from './pages/QuestGenerator/components/PreferenceForm/locales/en/translation.json';
import PreferenceFormDe from './pages/QuestGenerator/components/PreferenceForm/locales/de/translation.json';
import WeeklyOverviewEn from './pages/QuestGenerator/components/WeeklyOverview/locales/en/translation.json';
import WeeklyOverviewDe from './pages/QuestGenerator/components/WeeklyOverview/locales/de/translation.json';
import QuestCardEn from './pages/QuestGenerator/components/QuestCard/locales/en/translation.json';
import QuestCardDe from './pages/QuestGenerator/components/QuestCard/locales/de/translation.json';

const resources = {
  en: {
    header: HeaderEn,
    footer: FooterEn,
    home: HomeEn,
    dashboard: DashboardEn,
    auth: AuthEn,
    settings: SettingsEn,
    questGenerator: QuestGeneratorEn,
    preferenceForm: PreferenceFormEn,
    weeklyOverview: WeeklyOverviewEn,
    questCard: QuestCardEn,
  },
  de: {
    header: HeaderDe,
    footer: FooterDe,
    home: HomeDe,
    dashboard: DashboardDe,
    auth: AuthDe,
    settings: SettingsDe,
    questGenerator: QuestGeneratorDe,
    preferenceForm: PreferenceFormDe,
    weeklyOverview: WeeklyOverviewDe,
    questCard: QuestCardDe,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;


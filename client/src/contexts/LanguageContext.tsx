import { createContext, useContext, ReactNode } from 'react';

export type Language = 'kz';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  kz: {
    // Navigation
    'nav.home': 'Басты бет',
    'nav.about': 'Мектеп туралы',
    'nav.education': 'Білім беру',
    'nav.news': 'Жаңалықтар',
    'nav.team': 'Біздің команда',
    'nav.teachers': 'Біздің мұғалімдер',
    'nav.primaryTeachers': 'Бастауыш сынып мұғалімдері',
    'nav.subjectTeachers': 'Пән мұғалімдері',
    'nav.curators': 'Куратор мұғалімдер',
    'nav.clubs': 'Үйірмелер',
    'nav.admission': 'Қабылдау',
    'nav.contact': 'Байланыс',
    
    // Hero Section
    'hero.title': 'FGS - Болашақ ұрпақ мектебіне қош келдіңіздер!',
    'hero.subtitle': '0-9 сыныптары үшін қазіргі заманғы білім беру орталығы. Балаларыңыздың болашағына инвестиция жасаңыз.',
    'hero.apply': 'Өтінім жіберу',
    'hero.call': 'Қоңырау шалу',
    'hero.workingHours': 'Жұмыс уақыты: 08:00 - 18:00',
    'hero.phoneNumber': '+7‒775‒790‒63‒63',
    
    // Statistics
    'stats.since': 'Жылдан бастап',
    // ========================================
    // ИЗМЕНИТЬ ДИАПАЗОН КОЛИЧЕСТВА ДЕТЕЙ В КЛАССЕ
    // Текущее значение: 12-18
    // Чтобы изменить, замените "12-18" на новое значение (например, "10-15", "15-20")
    // ========================================
    'stats.students': '12-18 сыныптағы балалар',
    'stats.admission': '< 50% НИШ/РФМШ түсу',
    
    // Features
    'features.title': 'Неліктен FGS мектебін таңдау керек?',
    'features.subtitle': 'Біз балаларыңыздың толыққанды дамуы үшін барлық жағдай жасаймыз',
    'features.education': 'Сапалы білім беру',
    'features.education.desc': '0-9 сыныптары үшін толық бағдарлама',
    'features.meals': 'Сапалы тамақтану',
    'features.meals.desc': 'Диетологтармен жасалған мәзір',
    'features.transport': 'Оқушы тасымалы',
    'features.transport.desc': 'Қауіпсіз және ыңғайлы көлік',
    
    // Teacher Pages
    'teachers.primary.title': 'Бастауыш сынып мұғалімдері',
    'teachers.primary.subtitle': 'Балалардың оқуға деген сүйіспеншілігін ояту үшін жауапты мұғалімдер',
    'teachers.subject.title': 'Пән мұғалімдері',
    'teachers.subject.subtitle': 'Әртүрлі пәндер бойынша мамандандырылған тәжірибелі мұғалімдер',
    'teachers.curators.title': 'Куратор мұғалімдер',
    'teachers.curators.subtitle': 'Әрбір сыныпты жеке қамтамасыз ететін куратор мұғалімдер',
    'teachers.backToHome': 'Басты бетке оралу',
    'teachers.about': 'туралы',
    'teachers.photosComingSoon': 'Мұғалімдердің фотосуреттері жақын арада қосылады',
    
    // Common
    'common.readMore': 'Толығырақ оқу',
    'common.viewAll': 'Барлығын көру',
    
    // Language Switching
    'lang.kazakh': 'Қазақша',
    'lang.russian': 'Русский',
    'lang.switch': 'Тілді ауыстыру'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language: Language = 'kz';

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['kz']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
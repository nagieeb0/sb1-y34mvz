import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
        <Globe className="w-5 h-5" />
        <span>{languages.find(lang => lang.code === i18n.language)?.name || 'Language'}</span>
      </button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 hidden group-hover:block">
        <div className="py-1" role="menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className={`block px-4 py-2 text-sm w-full text-left ${
                i18n.language === lang.code
                  ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              role="menuitem"
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
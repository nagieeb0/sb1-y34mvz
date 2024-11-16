import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, Stethoscope } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md fixed w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              {t('brand')}
            </span>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.features')}
            </a>
            <a href="#ai-solutions" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.aiSolutions')}
            </a>
            <a href="#career" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.career')}
            </a>
            <LanguageSelector />
            <ThemeToggle />
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              {t('nav.getStarted')}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.features')}
            </a>
            <a href="#ai-solutions" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.aiSolutions')}
            </a>
            <a href="#career" className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              {t('nav.career')}
            </a>
            <button className="w-full mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              {t('nav.getStarted')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
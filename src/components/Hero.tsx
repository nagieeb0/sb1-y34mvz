import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Brain, Calendar, LineChart } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">{t('hero.title1')}</span>
            <span className="block text-primary-600 dark:text-primary-400">{t('hero.title2')}</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors md:py-4 md:text-lg md:px-10">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { Icon: Calendar, title: t('features.clinicManagement.title'), description: t('features.clinicManagement.description') },
            { Icon: Brain, title: t('features.aiSolutions.title'), description: t('features.aiSolutions.description') },
            { Icon: LineChart, title: t('features.career.title'), description: t('features.career.description') }
          ].map(({ Icon, title, description }) => (
            <div key={title} className="card">
              <div className="flex items-start space-x-4">
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
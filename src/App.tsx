import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}

export default App;
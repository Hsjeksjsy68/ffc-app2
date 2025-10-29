
import React, { useState } from 'react';
import { Feature } from './types';
import NewsSection from './components/NewsSection';
import FindUsSection from './components/FindUsSection';
import FanArtGenerator from './components/FanArtGenerator';
import MatchAnalyzer from './components/MatchAnalyzer';
import PlayerSection from './components/PlayerSection';
import ModeratorSection from './components/ModeratorSection';
import ScheduleSection from './components/ScheduleSection';
import ContactSection from './components/ContactSection';
import { LogoIcon, NewsIcon, MapIcon, ArtIcon, AnalyzeIcon, PlayersIcon, ModeratorIcon, MenuIcon, CloseIcon, CalendarDaysIcon, EnvelopeIcon } from './components/Icons';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('news');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFeatureSelect = (feature: Feature) => {
    setActiveFeature(feature);
    setIsMenuOpen(false);
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'news':
        return <NewsSection />;
      case 'schedule':
        return <ScheduleSection />;
      case 'map':
        return <FindUsSection />;
      case 'art':
        return <FanArtGenerator />;
      case 'analyzer':
        return <MatchAnalyzer />;
      case 'players':
        return <PlayerSection />;
      case 'moderator':
        return <ModeratorSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <NewsSection />;
    }
  };

  const NavButton = ({ feature, label, icon }: { feature: Feature; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveFeature(feature)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        activeFeature === feature
          ? 'bg-brand-red text-white'
          : 'text-gray-300 hover:bg-brand-gray hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
  
  const MobileNavButton = ({ feature, label, icon }: { feature: Feature; label: string; icon: React.ReactNode }) => (
    <button
      onClick={() => handleFeatureSelect(feature)}
      className={`flex items-center w-full gap-4 p-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
        activeFeature === feature
          ? 'bg-brand-red text-white'
          : 'text-gray-300 hover:bg-brand-gray hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const navItems = [
      { feature: 'news' as Feature, label: 'Latest News', icon: <NewsIcon className="h-6 w-6" /> },
      { feature: 'schedule' as Feature, label: 'Schedule', icon: <CalendarDaysIcon className="h-6 w-6" /> },
      { feature: 'map' as Feature, label: 'Find Us', icon: <MapIcon className="h-6 w-6" /> },
      { feature: 'art' as Feature, label: 'Fan Art', icon: <ArtIcon className="h-6 w-6" /> },
      { feature: 'analyzer' as Feature, label: 'Analyzer', icon: <AnalyzeIcon className="h-6 w-6" /> },
      { feature: 'players' as Feature, label: 'Club Players', icon: <PlayersIcon className="h-6 w-6" /> },
      { feature: 'moderator' as Feature, label: 'Moderator', icon: <ModeratorIcon className="h-6 w-6" /> },
      { feature: 'contact' as Feature, label: 'Contact', icon: <EnvelopeIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <header className="bg-brand-gray/80 backdrop-blur-sm sticky top-0 z-20 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <LogoIcon className="h-10 w-10" />
              <h1 className="ml-3 text-2xl md:text-3xl font-bold text-white tracking-wider uppercase">
                Flameunter FC
              </h1>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
               {navItems.map(item => (
                   <NavButton key={item.feature} feature={item.feature} label={item.label} icon={React.cloneElement(item.icon, { className: 'h-5 w-5'})} />
               ))}
            </nav>
            {/* Mobile Nav Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="text-gray-300 hover:text-white p-2" aria-label="Open menu">
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-brand-dark/95 z-50 flex flex-col p-4 animate-fade-in" role="dialog" aria-modal="true">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <LogoIcon className="h-10 w-10" />
              <h2 className="ml-3 text-2xl font-bold text-white">Menu</h2>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white p-2" aria-label="Close menu">
              <CloseIcon className="h-8 w-8" />
            </button>
          </div>
          <nav className="flex flex-col gap-3">
             {navItems.map(item => <MobileNavButton key={item.feature} {...item} />)}
          </nav>
        </div>
      )}

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {renderFeature()}
      </main>
      
      <footer className="bg-brand-gray/50 py-4 text-center text-gray-400 text-sm">
        <p>Powered by Gemini | For the true fans of Flameunter FC</p>
      </footer>
    </div>
  );
};

export default App;
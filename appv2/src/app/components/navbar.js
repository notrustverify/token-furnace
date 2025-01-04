"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaTelegram, FaGithub, FaChevronLeft, FaChevronRight, FaWallet, FaCoins } from 'react-icons/fa';
import { LayoutDashboard, Coins, MessageCircleMore, PencilLine, ShieldCheck, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoExtensionPuzzleOutline } from 'react-icons/io5';
import { FaDesktop, FaQrcode, FaDownload } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { AlephiumConnectButton } from '@alephium/web3-react';

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  if (isMobile) {
    return (
      <>
        <motion.div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700/50 z-[99]">
          <div className="flex justify-around items-center h-full px-6">
            <NavLink href="/" icon={<Coins size={24} />} text={t('burn')} isMobile={true} />
            <NavLink href="/burn" icon={<BookOpen size={24} />} text={t('history')} isMobile={true} />
          </div>
        </motion.div>
        <MobileMenu />
        <div className="fixed top-6 right-6 z-[97]">
          <AlephiumConnectButton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <AlephiumConnectButton />
      </div>

      <motion.div
        initial={{ width: isCollapsed ? '5rem' : '16rem' }}
        animate={{ width: isCollapsed ? '5rem' : '16rem' }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-full ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700/50'
            : 'bg-white/50 border-gray-200/50'
        } backdrop-blur-xl border-r`}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 p-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white"
        >
          {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
        </motion.button>

        <div className="p-6">
          <Link href="/" className="flex items-center justify-center">
            <span className={`${isCollapsed ? 'text-sm' : 'text-xl'} font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {isCollapsed ? 'TF' : 'Token Furnace'}
            </span>
          </Link>
        </div>

        <div className="px-3 py-4">
          <nav className="space-y-1">
            <NavLink href="/" icon={<Coins size={20} />} text={t('burn')} isCollapsed={isCollapsed} />
            <NavLink href="/burn" icon={<BookOpen size={20} />} text={t('history')} isCollapsed={isCollapsed} />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          {!isCollapsed ? (
            <>
              <div className="flex justify-center items-center gap-2 mb-3">
                <button
                  onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'fr' : 'en')}
                  className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <Image
                    src={`/images/flags/${currentLanguage === 'en' ? 'en' : 'fr'}.png`}
                    alt={currentLanguage === 'en' ? 'English' : 'Français'}
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                  <span className="text-sm text-gray-400">
                    {currentLanguage === 'en' ? 'English' : 'Français'}
                  </span>
                </button>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700/50 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-200/50 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <div className="flex justify-center gap-6">
                <SocialLink href="https://x.com/notrustverif" icon={<FaTwitter size={16} />} className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} />
                <SocialLink href="https://github.com/notrustverify/token-furnace" icon={<FaGithub size={16} />} className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'fr' : 'en')}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Image
                  src={`/images/flags/${currentLanguage === 'en' ? 'en' : 'fr'}.png`}
                  alt={currentLanguage === 'en' ? 'English' : 'Français'}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              </button>
              <SocialLink href="https://x.com/notrustverif" icon={<FaTwitter size={16} />} className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} />
              <SocialLink href="https://github.com/notrustverify/token-furnace" icon={<FaGithub size={16} />} className={theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function NavLink({ href, icon, text, isCollapsed, soon = false, isMobile = false, onClick }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  if (isMobile) {
    return (
      <Link 
        href={soon ? "#" : href}
        className={`
          flex flex-col items-center justify-center space-y-1
          ${soon ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/50'}
          ${href === pathname ? 'text-orange-400' : 'text-gray-400 hover:text-white'}
          transition-colors duration-200
        `}
        onClick={(e) => {
          if (soon) {
            e.preventDefault();
          }
          onClick?.();
        }}
      >
        {icon}
        <span className="text-xs">{text}</span>
        {soon && <span className="text-[10px] text-orange-400">soon</span>}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <Link 
        href={soon ? "#" : href}
        className={`
          flex items-center space-x-3 px-3 py-2 rounded-lg
          ${soon ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/50'}
          ${href === pathname 
            ? 'bg-orange-400/10 text-orange-400' 
            : `${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`
          }
          transition-colors duration-200
        `}
      >
        {icon}
        {!isCollapsed && (
          <span className="flex-1">
            {text}
            {soon && <span className="text-xs text-orange-400 ml-2">soon</span>}
          </span>
        )}
      </Link>
      
      {isCollapsed && (
        <div className="
          absolute left-full ml-2 px-2 py-1 
          bg-gray-800 text-white text-sm rounded-md 
          opacity-0 group-hover:opacity-100
          pointer-events-none
          transform -translate-x-2 group-hover:translate-x-0
          transition-all duration-150
          whitespace-nowrap
          z-50
        ">
          {text}
          {soon && <span className="text-xs text-orange-400 ml-1">soon</span>}
        </div>
      )}
    </div>
  );
}

function SocialLink({ href, icon, className }) {
  const { theme } = useTheme();

  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </motion.a>
  );
} 
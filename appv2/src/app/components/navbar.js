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
import { useWallet, useConnect, useConnectSettingContext } from '@alephium/web3-react';
import { ANS } from '@alph-name-service/ans-sdk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

function WalletModal({ isOpen, onClose, onConnect, isLoading, theme }) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-[640px]">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-pink-500/20 to-blue-500/20 opacity-50 blur-[100px] rounded-full" />
        <motion.div
          className={`${
            theme === 'dark' 
              ? 'bg-gray-800/90 text-white border-gray-700/50' 
              : 'bg-white/90 text-gray-900 border-gray-200/50'
          } backdrop-blur-xl p-8 rounded-2xl border`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{t('connectWallet')}</h2>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose} 
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-400 mb-3">{t('newUser')}</h3>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://alephium.org/#wallets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center backdrop-blur-xl border border-gray-700/50"
                >
                  <FaDownload className="mr-3" /> {t('getAlephiumWallet')}
                </motion.a>
              </div>

              <div>
                <h3 className="text-gray-400 mb-3">{t('existingUser')}</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onConnect('injected')}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center backdrop-blur-xl border border-gray-700/50"
                  >
                    <IoExtensionPuzzleOutline className="mr-3" /> {t('alephiumExtension')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onConnect('desktopWallet')}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center backdrop-blur-xl border border-gray-700/50"
                  >
                    <FaDesktop className="mr-3" /> {t('alephiumDesktop')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onConnect('walletConnect')}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center backdrop-blur-xl border border-gray-700/50"
                  >
                    <FaQrcode className="mr-3" /> {t('walletConnect')}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400"></div>
                  <p className="text-lg font-semibold">{t('openingWallet')}</p>
                  <p className="text-sm text-gray-400 text-center">
                    {t('checkWallet')}
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">{t('whatIsWallet')}</h3>
                  <p className="text-gray-400">{t('homeForAssets')}</p>
                  <p className="text-sm text-gray-300">
                    {t('walletDescription')}
                  </p>
                  <div className="flex space-x-3">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://alephium.org/#wallets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 bg-orange-400 text-gray-900 rounded-lg font-semibold hover:bg-orange-500"
                    >
                      {t('getWallet')}
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://docs.alephium.org/wallet"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg backdrop-blur-xl border border-gray-700/50"
                    >
                      {t('learnMore')}
                    </motion.a>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();
  const context = useConnectSettingContext();
  const { connect, disconnect } = useConnect();
  const [connectClicked, setConnectClicked] = useState(false);
  const [opened, setOpened] = useState(false);
  const [ansName, setAnsName] = useState('');
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleConnect = useCallback((method) => {
    console.log('handleConnect called with method:', method);
    setIsLoading(true);
    context.setConnectorId(method);
    setConnectClicked(true);
    setOpened(true);
    console.log('States after handleConnect:', { isLoading: true, connectClicked: true, opened: true });
  }, [context]);

  useEffect(() => {
    console.log('Connection effect triggered with states:', { connectClicked, opened });
    if (connectClicked && opened) {
      setConnectClicked(false);
      console.log('Attempting to connect...');
      connect().then(() => {
        console.log('Connection successful');
        setOpened(false);
        setIsModalOpen(false);
      }).catch((error) => {
        console.error('Connection failed:', error);
      }).finally(() => {
        setIsLoading(false);
        console.log('Connection attempt finished');
      });
    }
  }, [connectClicked, opened, connect]);

  const handleDisconnect = useCallback(async () => {
    console.log('handleDisconnect called');
    try {
      await disconnect();
      console.log('Disconnect successful');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  }, [disconnect]);

  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen });
  }, [isModalOpen]);

  useEffect(() => {
    if (wallet?.account?.address) {
      const getProfile = async () => {
        const ans = new ANS('mainnet', true, "https://node.alphaga.app", "https://backend.mainnet.alephium.org");
        const profile = await ans.getProfile(wallet.account.address);
        if (profile?.name) {
          setAnsName(profile.name);
        }
      };
      getProfile();
    }
  }, [wallet?.account?.address]);

  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent z-[97]" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="fixed bottom-16 left-0 right-0 bg-gray-800/90 backdrop-blur-xl p-4 rounded-t-2xl border-t border-gray-700/50 z-[98]"
          >
            <div className="grid grid-cols-2 gap-4">
              <NavLink 
                href="/" 
                icon={<Coins size={20} />} 
                text={t('burn')} 
                isMobile={true} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <NavLink 
                href="/burn" 
                icon={<BookOpen size={20} />} 
                text={t('history')} 
                isMobile={true} 
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (isMobile) {
    return (
      <>
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Modal close triggered');
          setIsModalOpen(false);
          setOpened(false);
        }}
        onConnect={(method) => {
          console.log('onConnect triggered with method:', method);
          handleConnect(method);
        }}
        isLoading={isLoading}
        theme={theme}
      />
        <motion.div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-800/90 backdrop-blur-xl border-t border-gray-700/50 z-[99]">
          <div className="flex justify-around items-center h-full px-6">
            <NavLink href="/" icon={<Coins size={24} />} text={t('burn')} isMobile={true} />
            <NavLink href="/burn" icon={<BookOpen size={24} />} text={t('history')} isMobile={true} />
          </div>
        </motion.div>
        <MobileMenu />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="fixed top-6 right-6 flex items-center space-x-2 bg-orange-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-orange-500 z-[97] font-semibold"
          onClick={() => wallet?.account?.address ? handleDisconnect() : setIsModalOpen(true)}
        >
          <FaWallet size={18} />
          <span>
            {wallet?.account?.address 
              ? (ansName || `${wallet?.account?.address.slice(0, 6)}...${wallet?.account?.address.slice(-4)}`)
              : 'Connect Wallet'
            }
          </span>
        </motion.button>
      </>
    );
  }

  return (
    <>
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Modal close triggered');
          setIsModalOpen(false);
          setOpened(false);
        }}
        onConnect={(method) => {
          console.log('onConnect triggered with method:', method);
          handleConnect(method);
        }}
        isLoading={isLoading}
        theme={theme}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fixed top-6 right-6 flex items-center space-x-2 bg-orange-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-orange-500 z-50 font-semibold"
        onClick={() => {
          console.log('Connect button clicked, current wallet state:', !!wallet?.account?.address);
          if (wallet?.account?.address) {
            handleDisconnect();
          } else {
            console.log('Opening modal');
            setIsModalOpen(true);
          }
        }}
      >
        <FaWallet size={18} />
        <span>
          {wallet?.account?.address 
            ? (ansName || `${wallet?.account?.address.slice(0, 6)}...${wallet?.account?.address.slice(-4)}`)
            : 'Connect Wallet'
          }
        </span>
      </motion.button>

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
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    burn: "Burn",
    history: "History",
    connectWallet: "Connect Wallet",
    blockHeight: "Block Height",
    hashrate: "Hashrate",
    
    // Wallet Modal
    newUser: "New User",
    existingUser: "Existing User",
    getAlephiumWallet: "Get an Alephium wallet",
    alephiumExtension: "Alephium Extension",
    alephiumDesktop: "Alephium Desktop",
    walletConnect: "Wallet Connect",
    soon: "soon",
    whatIsWallet: "What is a Wallet?",
    homeForAssets: "A Home for your Digital Assets",
    walletDescription: "Alephium Wallets are used to send, receive, store, and display all of your digital assets like $ALPH. Select your preferred method or create a new alephium wallet to get started.",
    getWallet: "Get a Wallet",
    learnMore: "Learn More",
    openingWallet: "Opening Wallet...",
    checkWallet: "Please check your wallet extension or application to continue the connection process",
    mostBurnedTokens: "Most Burned Tokens",
    tokens: "tokens",
    burns: "burns",
    connectWalletMessage: "Connect your wallet to burn tokens",

    // Burn History Page
    burnHistory: "Burn History",
    totalBurns: "Total Burns",
    topBurners: "Top Burners",
    viewTransaction: "View Transaction",
    by: "by",
    burned: "burned",
    recentBurns: "Recent Burns",

    // Burn Interface
    selectTokenToBurn: "Select a token to burn",
    select: "Select",
    availableBalance: "Available Balance",
    enterAmount: "Enter amount",
    insufficientBalance: "Insufficient balance",
    burnButton: "Burn Tokens",
    confirmBurn: "Confirm Burn",
    burnSuccess: "Successfully burned",
    burnError: "Error burning tokens",
    connectWalletToBurn: "Connect wallet to burn tokens",
  },
  fr: {
    // Navbar
    burn: "Brûler",
    history: "Historique",
    connectWallet: "Connecter Wallet",
    blockHeight: "Hauteur de Bloc",
    hashrate: "Taux de Hachage",
    
    // Wallet Modal
    newUser: "Nouvel Utilisateur",
    existingUser: "Utilisateur Existant",
    getAlephiumWallet: "Obtenir un Wallet",
    alephiumExtension: "Extension Alephium",
    alephiumDesktop: "Alephium Bureau",
    walletConnect: "Wallet Connect",
    soon: "bientôt",
    whatIsWallet: "Qu'est-ce qu'un Wallet ?",
    homeForAssets: "Un espace pour vos actifs numériques",
    walletDescription: "Les wallets Alephium sont utilisés pour envoyer, recevoir, stocker et afficher tous vos actifs numériques comme $ALPH. Sélectionnez votre méthode préférée ou créez un nouveau wallet alephium pour commencer.",
    getWallet: "Obtenir un Wallet",
    learnMore: "En savoir plus",
    openingWallet: "Ouverture du Wallet...",
    checkWallet: "Veuillez vérifier votre extension ou application de wallet pour continuer le processus de connexion",
    mostBurnedTokens: "Tokens les plus brûlés",
    tokens: "tokens",
    burns: "burns",
    connectWalletMessage: "Connectez votre wallet pour brûler des tokens",

    // Burn History Page
    burnHistory: "Historique des Burns",
    totalBurns: "Total des Burns",
    topBurners: "Meilleurs Brûleurs",
    viewTransaction: "Voir la transaction",
    by: "par",
    burned: "brûlé",
    recentBurns: "Burns Récents",

    // Burn Interface
    selectTokenToBurn: "Sélectionnez un token à brûler",
    select: "Sélectionner",
    availableBalance: "Solde disponible",
    enterAmount: "Entrer le montant",
    insufficientBalance: "Solde insuffisant",
    burnButton: "Brûler les tokens",
    confirmBurn: "Confirmer la destruction",
    burnSuccess: "Tokens brûlés avec succès",
    burnError: "Erreur lors de la destruction",
    connectWalletToBurn: "Connectez votre wallet pour brûler des tokens",
  }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('preferredLanguage');
    if (stored) {
      setCurrentLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('preferredLanguage', currentLanguage);
    }
  }, [currentLanguage, isClient]);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t: (key) => translations[currentLanguage][key] || key
  };

  return (
    <LanguageContext.Provider value={value}>
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
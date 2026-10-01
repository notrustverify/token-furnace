"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    burnPageTitle: "Burn tokens on Alephium",
    burnPageDescription:
      "Choose your tokens, set an amount, and optionally receive a proof NFT.",
    activityUnavailable: "Waiting for network activity",
    activityUnavailableText:
      "Some activity could not be loaded. Check your connection or try again later.",
    skipContent: "Skip to content",
    builtOn: "BUILT ON ALEPHIUM",
    workspace: "Workspace",
    navigation: "Main navigation",
    sidebarNote: "A little less supply. A lasting on-chain record.",
    sourceCode: "Source code",
    byNTV: "Made by No Trust Verify",
    switchLanguage: "Switch to French",
    lightTheme: "Use light theme",
    darkTheme: "Use dark theme",
    heroEyebrow: "THE TOKEN FURNACE",
    heroTitle: "Less supply.",
    heroAccent: "More possibility.",
    heroDescription:
      "Give your tokens a final destination. Burn on Alephium and optionally collect an NFT to mark the moment.",
    burnPanelTitle: "Burn your tokens",
    burnPanelDescription:
      "Choose a token, set an amount, and make it permanent.",
    walletTitle: "Your furnace is ready",
    furnaceWalletDescription:
      "Connect your Alephium wallet to see your tokens and start your first burn.",
    stepOne: "Connect your wallet",
    stepOneText:
      "Your tokens stay in your wallet until you approve a transaction.",
    stepTwo: "Choose what to burn",
    stepTwoText: "Select ALPH, a listed token, or enter a custom token ID.",
    stepThree: "Leave your mark",
    stepThreeText: "Optionally receive an NFT as a record of your burn.",
    howItWorks: "A SIMPLE PROCESS",
    irreversible: "Burns are permanent. Tokens cannot be recovered.",
    customToken: "Custom token",
    tokenId: "Token ID",
    amount: "Amount to burn",
    nftNote: "Optional · additional deposit of 0.1 ALPH",
    historyEyebrow: "ON-CHAIN ACTIVITY",
    historyTitle: "Every burn leaves a mark.",
    historyDescription:
      "Explore burn activity and the wallets reducing supply on Alephium.",
    noBurns: "No burns to show yet",
    noBurnsText:
      "Burn events will appear here as they are received from the network.",
    noRankings: "Rankings appear when burn activity is available.",
    notFoundTitle: "This page went up in smoke.",
    notFoundText:
      "The page you’re looking for could not be found. Let’s get you back to the furnace.",
    backHome: "Back to the furnace",
    pendingBurn: "Waiting for your wallet…",
    transactionSubmitted: "Transaction submitted",
    burnSummary: "Burn summary",
    burnFailed:
      "The transaction could not be submitted. Please check your wallet and try again.",

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
    walletDescription:
      "Alephium Wallets are used to send, receive, store, and display all of your digital assets like $ALPH. Select your preferred method or create a new alephium wallet to get started.",
    getWallet: "Get a Wallet",
    learnMore: "Learn More",
    openingWallet: "Opening Wallet...",
    checkWallet:
      "Please check your wallet extension or application to continue the connection process",
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
    receiveNFT: "Receive NFT for this burn",
    confirmBurnTitle: "Confirm Burn",
    confirmBurnMessage: "Are you sure you want to burn",
    confirmBurnAll: "Are you sure you want to burn all your",
    cancel: "Cancel",
    confirm: "Confirm",
  },
  fr: {
    burnPageTitle: "Brûlez des tokens sur Alephium",
    burnPageDescription:
      "Choisissez vos tokens, un montant et, si vous le souhaitez, un NFT souvenir.",
    activityUnavailable: "En attente de l’activité du réseau",
    activityUnavailableText:
      "Certaines données n’ont pas pu être chargées. Vérifiez votre connexion ou réessayez plus tard.",
    skipContent: "Aller au contenu",
    builtOn: "SUR ALEPHIUM",
    workspace: "Espace de travail",
    navigation: "Navigation principale",
    sidebarNote: "Moins de tokens. Une trace durable sur la blockchain.",
    sourceCode: "Code source",
    byNTV: "Créé par No Trust Verify",
    switchLanguage: "Passer en anglais",
    lightTheme: "Activer le thème clair",
    darkTheme: "Activer le thème sombre",
    heroEyebrow: "LE TOKEN FURNACE",
    heroTitle: "Moins de tokens.",
    heroAccent: "Plus de possibilités.",
    heroDescription:
      "Donnez une destination finale à vos tokens. Brûlez sur Alephium et recevez, si vous le souhaitez, un NFT souvenir.",
    burnPanelTitle: "Brûlez vos tokens",
    burnPanelDescription:
      "Choisissez un token, un montant, puis rendez-le permanent.",
    walletTitle: "Votre four est prêt",
    furnaceWalletDescription:
      "Connectez votre wallet Alephium pour voir vos tokens et commencer.",
    stepOne: "Connectez votre wallet",
    stepOneText:
      "Vos tokens restent dans votre wallet jusqu’à votre approbation.",
    stepTwo: "Choisissez vos tokens",
    stepTwoText:
      "Sélectionnez ALPH, un token listé ou saisissez son identifiant.",
    stepThree: "Laissez votre empreinte",
    stepThreeText: "Recevez un NFT optionnel comme souvenir de votre burn.",
    howItWorks: "UN PROCESSUS SIMPLE",
    irreversible:
      "Les burns sont définitifs. Les tokens ne peuvent pas être récupérés.",
    customToken: "Token personnalisé",
    tokenId: "Identifiant du token",
    amount: "Montant à brûler",
    nftNote: "Optionnel · dépôt supplémentaire de 0,1 ALPH",
    historyEyebrow: "ACTIVITÉ SUR LA BLOCKCHAIN",
    historyTitle: "Chaque burn laisse une trace.",
    historyDescription:
      "Découvrez les burns et les wallets qui réduisent la quantité de tokens sur Alephium.",
    noBurns: "Aucun burn pour le moment",
    noBurnsText:
      "Les événements apparaîtront ici dès leur réception depuis le réseau.",
    noRankings: "Le classement apparaîtra avec les premiers événements.",
    notFoundTitle: "Cette page est partie en fumée.",
    notFoundText: "Cette page est introuvable. Revenons au four.",
    backHome: "Retour au four",
    pendingBurn: "En attente de votre wallet…",
    transactionSubmitted: "Transaction envoyée",
    burnSummary: "Résumé du burn",
    burnFailed:
      "La transaction n’a pas pu être envoyée. Vérifiez votre wallet et réessayez.",

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
    walletDescription:
      "Les wallets Alephium sont utilisés pour envoyer, recevoir, stocker et afficher tous vos actifs numériques comme $ALPH. Sélectionnez votre méthode préférée ou créez un nouveau wallet alephium pour commencer.",
    getWallet: "Obtenir un Wallet",
    learnMore: "En savoir plus",
    openingWallet: "Ouverture du Wallet...",
    checkWallet:
      "Veuillez vérifier votre extension ou application de wallet pour continuer le processus de connexion",
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
    receiveNFT: "Recevoir un NFT pour ce burn",
    confirmBurnTitle: "Confirmer le Burn",
    confirmBurnMessage: "Êtes-vous sûr de vouloir brûler",
    confirmBurnAll: "Êtes-vous sûr de vouloir brûler tous vos",
    cancel: "Annuler",
    confirm: "Confirmer",
  },
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("preferredLanguage");
    if (stored === "en" || stored === "fr") {
      setCurrentLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("preferredLanguage", currentLanguage);
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, isClient]);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t: (key) => translations[currentLanguage][key] || key,
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

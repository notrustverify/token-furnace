"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  History,
  ArrowUpRight,
  Moon,
  Sun,
  Globe,
  Code2,
} from "lucide-react";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { getNetwork } from "../services/utils";

export default function Navbar() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("skipContent")}
      </a>
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Flame size={25} />
          </span>
          <span>
            Token Furnace<small>{t("builtOn")}</small>
          </span>
        </Link>
        <div className="nav-caption">{t("workspace")}</div>
        <nav className="primary-nav" aria-label={t("navigation")}>
          {[
            ["/", Flame, "burn"],
            ["/burn", History, "history"],
          ].map(([href, Icon, key]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`nav-item ${pathname === href ? "active" : ""}`}
            >
              <Icon size={19} />
              <span>{t(key)}</span>
              {pathname === href && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="network-label">
            <span className="status-dot" />
            Alephium <span>{getNetwork()}</span>
          </div>
          <div className="sidebar-note">
            <Flame size={18} />
            <p>{t("sidebarNote")}</p>
          </div>
          <a
            className="resource-link"
            href="https://github.com/notrustverify/token-furnace"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 size={17} />
            {t("sourceCode")}
            <ArrowUpRight size={15} />
          </a>
          <a
            className="resource-link"
            href="https://x.com/notrustverif"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("byNTV")}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </aside>
      <header className="topbar">
        <Link href="/" className="mobile-brand" aria-label="Token Furnace">
          <Flame size={24} />
          <span>Token Furnace</span>
        </Link>
        <div className="breadcrumb">
          {t("workspace")}
          <span>/</span>
          <strong>{t(pathname === "/burn" ? "history" : "burn")}</strong>
        </div>
        <div className="topbar-actions">
          <button
            className="icon-button language-button"
            onClick={() =>
              setCurrentLanguage(currentLanguage === "en" ? "fr" : "en")
            }
            aria-label={t("switchLanguage")}
          >
            <Globe size={17} />
            <span>{currentLanguage.toUpperCase()}</span>
          </button>
          <button
            className="icon-button"
            onClick={toggleTheme}
            aria-label={t(isDark ? "lightTheme" : "darkTheme")}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="wallet-button">
            <AlephiumConnectButton />
          </div>
        </div>
      </header>
    </>
  );
}

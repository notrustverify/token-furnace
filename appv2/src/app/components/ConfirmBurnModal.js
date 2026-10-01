import { useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function ConfirmBurnModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  symbol,
  isMax,
}) {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const dialogRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const buttons = dialogRef.current.querySelectorAll("button");
    buttons[0]?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`confirm-panel relative z-10 p-6 rounded-2xl shadow-xl max-w-md w-full m-4 ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h2 id="confirm-title" className="text-xl font-semibold mb-4">
          {t("confirmBurnTitle")}
        </h2>

        <p className="mb-6">
          {isMax
            ? `${t("confirmBurnAll")} ${symbol} ${t("tokens")}?`
            : `${t("confirmBurnMessage")} ${amount} ${symbol}?`}
        </p>

        <p className="mb-6">{t("irreversible")}</p>
        <div className="flex justify-end gap-4">
          <button
            autoFocus
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {t("cancel")}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

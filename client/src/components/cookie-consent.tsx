import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie файлдары туралы хабарландыру"
      data-testid="cookie-consent-banner"
    >
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0" />
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Cookie файлдары туралы хабарландыру
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-1">
          Біз сайтты пайдалануды барынша ыңғайлы ету үшін cookie файлдарын қолданамыз.
        </p>

        <Link
          href="/school-documents"
          className="text-sm font-medium text-primary hover:underline"
          data-testid="link-privacy-policy"
        >
          Құпиялылық саясаты
        </Link>

        <div className="flex flex-col gap-2 mt-4 sm:flex-row sm:items-center sm:gap-3">
          <Button
            onClick={() => handleChoice("accepted")}
            className="w-full rounded-full sm:flex-1"
            data-testid="button-accept-cookies"
          >
            Қабылдаймын
          </Button>
          <Button
            onClick={() => handleChoice("declined")}
            variant="outline"
            className="w-full rounded-full sm:flex-1"
            data-testid="button-decline-cookies"
          >
            Қабылдамаймын
          </Button>
        </div>
      </div>
    </div>
  );
}

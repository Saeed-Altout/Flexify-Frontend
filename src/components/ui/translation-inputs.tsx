"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface TranslationInputsProps {
  children: (locale: string, localeKey: string) => React.ReactNode;
  availableLocales?: string[];
  initialLocales?: string[];
  isLoading?: boolean;
}

const DEFAULT_LOCALES = ["en", "ar"];

export function TranslationInputs({
  children,
  availableLocales = DEFAULT_LOCALES,
  initialLocales = [],
  isLoading = false,
}: TranslationInputsProps) {
  const [activeLocales, setActiveLocales] = useState<string[]>(initialLocales);

  useEffect(() => {
    if (initialLocales.length > 0) {
      setActiveLocales(initialLocales);
    }
  }, [initialLocales]);

  const addTranslation = () => {
    const nextLocale = availableLocales.find(
      (locale) => !activeLocales.includes(locale)
    );
    if (nextLocale) {
      setActiveLocales([...activeLocales, nextLocale]);
    }
  };

  const removeTranslation = (locale: string) => {
    setActiveLocales(activeLocales.filter((l) => l !== locale));
  };

  const getLocaleLabel = (locale: string) => {
    const labels: Record<string, string> = {
      en: "English",
      ar: "Arabic",
    };
    return labels[locale] || locale.toUpperCase();
  };

  return (
    <div className="space-y-4">
      {activeLocales.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <Button
            type="button"
            variant="outline"
            onClick={addTranslation}
            disabled={isLoading}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Translation
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeLocales.map((locale) => {
            const localeKey = locale.charAt(0).toUpperCase() + locale.slice(1);
            return (
              <div key={locale} className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{getLocaleLabel(locale)}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTranslation(locale)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">{children(locale, localeKey)}</div>
              </div>
            );
          })}

          {activeLocales.length < availableLocales.length && (
            <Button
              type="button"
              variant="outline"
              onClick={addTranslation}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Translation
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

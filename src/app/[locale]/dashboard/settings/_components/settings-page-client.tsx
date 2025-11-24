"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heading } from "@/components/ui/heading";
import { GitHubTab } from "./github-tab";
import { CVTab } from "./cv-tab";
import { HeroTab } from "./hero-tab";
import { StatisticsTab } from "./statistics-tab";
import { AboutTab } from "./about-tab";
import { FooterTab } from "./footer-tab";

export function SettingsPageClient() {
  const t = useTranslations("dashboard.settings");

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <Heading
        title={t("title")}
        description={t("description")}
      />

      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="github" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.github")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <GitHubTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cv" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.cv")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <CVTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hero" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.hero")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <HeroTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="statistics" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.statistics")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <StatisticsTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="about" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.about")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <AboutTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="footer" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            {t("tabs.footer")}
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <FooterTab />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}


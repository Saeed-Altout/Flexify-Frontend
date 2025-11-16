"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function TechStackField() {
  const t = useTranslations("auth.projects.dashboard.form");

  const form = useFormContext();
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>(
    form.getValues("tech_stack") || []
  );

  const handleTechStackAdd = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      const newTech = [...techStack, techInput.trim()];
      setTechStack(newTech);
      form.setValue("tech_stack", newTech);
      setTechInput("");
    }
  };

  const handleTechStackRemove = (tech: string) => {
    const newTech = techStack.filter((t) => t !== tech);
    setTechStack(newTech);
    form.setValue("tech_stack", newTech);
  };

  return (
    <FormField
      control={form.control}
      name="tech_stack"
      render={() => (
        <FormItem>
          <FormLabel>{t("techStack")}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex gap-2">
                <InputGroup>
                  <InputGroupInput
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTechStackAdd();
                      }
                    }}
                    placeholder={t("techStackPlaceholder")}
                  />
                  <InputGroupAddon align="inline-end">
                    <Kbd>⏎</Kbd>
                  </InputGroupAddon>
                </InputGroup>
                <Button
                  type="button"
                  onClick={handleTechStackAdd}
                  variant="outline"
                >
                  {t("techStackAdd")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleTechStackRemove(tech)}
                      className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

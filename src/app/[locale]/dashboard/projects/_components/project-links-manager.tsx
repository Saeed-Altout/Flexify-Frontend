"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  X,
  Github,
  GitBranch,
  ExternalLink,
  FileText,
  BookOpen,
  Code,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkType, IProjectLink } from "@/modules/projects/projects-type";

interface ProjectLinksManagerProps {
  links: IProjectLink[];
  onChange: (links: IProjectLink[]) => void;
}

const LINK_TYPE_OPTIONS: {
  value: LinkType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "github", label: "GitHub", icon: Github },
  { value: "gitlab", label: "GitLab", icon: GitBranch },
  { value: "demo", label: "Demo", icon: ExternalLink },
  { value: "backend_github", label: "Backend GitHub", icon: Code },
  { value: "frontend_github", label: "Frontend GitHub", icon: Code },
  { value: "case_study", label: "Case Study", icon: FileText },
  { value: "blog", label: "Blog Post", icon: BookOpen },
  { value: "documentation", label: "Documentation", icon: BookOpen },
  { value: "api_docs", label: "API Docs", icon: Code },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

export function ProjectLinksManager({
  links,
  onChange,
}: ProjectLinksManagerProps) {
  const t = useTranslations("dashboard.projects.form.links");
  const [newLink, setNewLink] = useState<Partial<IProjectLink>>({
    linkType: "github",
    url: "",
    label: "",
  });

  const handleAddLink = () => {
    if (!newLink.url || !newLink.linkType) return;

    const link: IProjectLink = {
      id: `temp-${Date.now()}`,
      projectId: "",
      linkType: newLink.linkType as LinkType,
      url: newLink.url,
      label: newLink.label || null,
      icon: null,
      orderIndex: links.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onChange([...links, link]);
    setNewLink({ linkType: "github", url: "", label: "" });
  };

  const handleRemoveLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  const handleUpdateLink = (id: string, updates: Partial<IProjectLink>) => {
    onChange(
      links.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  };

  const getLinkIcon = (linkType: LinkType) => {
    const option = LINK_TYPE_OPTIONS.find((opt) => opt.value === linkType);
    return option ? option.icon : MoreHorizontal;
  };

  const getLinkLabel = (linkType: LinkType) => {
    const option = LINK_TYPE_OPTIONS.find((opt) => opt.value === linkType);
    return option ? option.label : linkType;
  };

  return (
    <div className="space-y-4">
      {/* Existing Links */}
      {links.length > 0 && (
        <div className="space-y-2">
          <Label>{t("existingLinks")}</Label>
          <div className="space-y-2">
            {links.map((link) => {
              const IconComponent = getLinkIcon(link.linkType);
              return (
                <Card key={link.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <IconComponent className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {getLinkLabel(link.linkType)}
                          </Badge>
                          {link.label && (
                            <span className="text-sm font-medium truncate">
                              {link.label}
                            </span>
                          )}
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary truncate block"
                        >
                          {link.url}
                        </a>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleRemoveLink(link.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Add New Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addNewLink")}</CardTitle>
          <CardDescription>{t("addNewLinkDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkType">{t("linkType")}</Label>
              <Select
                value={newLink.linkType}
                onValueChange={(value) =>
                  setNewLink({ ...newLink, linkType: value as LinkType })
                }
              >
                <SelectTrigger id="linkType">
                  <SelectValue placeholder={t("selectLinkType")} />
                </SelectTrigger>
                <SelectContent>
                  {LINK_TYPE_OPTIONS.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">{t("url")}</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder={t("urlPlaceholder")}
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkLabel">
                {t("label")} ({t("optional")})
              </Label>
              <Input
                id="linkLabel"
                placeholder={t("labelPlaceholder")}
                value={newLink.label || ""}
                onChange={(e) =>
                  setNewLink({ ...newLink, label: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleAddLink}
            disabled={!newLink.url || !newLink.linkType}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("addLink")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

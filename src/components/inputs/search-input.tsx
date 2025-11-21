import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { useTranslations } from "next-intl";

export function SearchInput({ ...props }: React.ComponentProps<"input">) {
  const t = useTranslations("common");
  return (
    <InputGroup className="max-w-md">
      <InputGroupInput
        type="search"
        placeholder={t("searchPlaceholder")}
        {...props}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

"use client";

import { useState } from "react";
import { KeyRoundIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

type PasswordType = "password" | "text";

export function PasswordInput({ ...props }: React.ComponentProps<"input">) {
  const [type, setType] = useState<PasswordType>("password");

  const handleType = (type: PasswordType) => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  return (
    <InputGroup>
      <InputGroupInput placeholder="password" type={type} {...props} />
      <InputGroupAddon>
        <KeyRoundIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" onClick={() => handleType(type)}>
          {type === "password" && <EyeIcon />}
          {type === "text" && <EyeOffIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}

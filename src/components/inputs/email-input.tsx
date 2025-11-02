import { MailIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

export function EmailInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <InputGroup>
      <InputGroupInput placeholder="email" type="email" {...props} />
      <InputGroupAddon>
        <MailIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

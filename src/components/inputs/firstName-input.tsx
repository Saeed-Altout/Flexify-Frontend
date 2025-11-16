import { UserIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

export function FirstNameInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <InputGroup>
      <InputGroupInput type="text" {...props} />
      <InputGroupAddon>
        <UserIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

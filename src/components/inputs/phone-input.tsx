import { PhoneIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

export function PhoneInput({ ...props }: React.ComponentProps<"input">) {
  return (
    <InputGroup>
      <InputGroupInput type="tel" {...props} />
      <InputGroupAddon>
        <PhoneIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}

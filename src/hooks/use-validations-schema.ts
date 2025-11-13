import * as z from "zod";
import { useTranslations } from "next-intl";

export function useValidationsSchema() {
  const t = useTranslations("validation");

  const email = () =>
    z.email({
      message: t("email.error"),
    });
  const password = () =>
    z.string().min(8, {
      message: t("password.message", { min: "8" }),
    });

  return {
    email,
    password,
  };
}

import * as z from "zod";

export type TFunction = (key: string, ...args: any[]) => string;

export function validationsSchema(t: TFunction) {
  const email = () =>
    z.email({
      message: t("email.message"),
      error: t("email.error"),
    });
  const password = () =>
    z.string().min(8, {
      message: t("password.message"),
      error: t("password.error"),
    });

  return {
    email,
    password,
  };
}

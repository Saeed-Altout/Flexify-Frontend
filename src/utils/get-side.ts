export function getSide(locale: string): "left" | "right" {
  return locale === "ar" ? "right" : "left";
}

export const WHATSAPP_NUMBER = "923354405555";
export const WHATSAPP_DISPLAY = "0335-4405555";
export const NOTIFY_EMAIL = "sales@mysmallthings.com";

export function waLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

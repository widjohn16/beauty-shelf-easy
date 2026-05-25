import { MessageCircle } from "lucide-react";

const PHONE = "5511967184446";
const MESSAGE = "Olá! Vim pelo site PJ Presentes & Variedades e gostaria de mais informações.";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp (11) 96718-4446"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">(11) 96718-4446</span>
    </a>
  );
}

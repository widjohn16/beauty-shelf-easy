import { MessageCircle } from "lucide-react";

const PHONE = "5511967184446";
const MESSAGE = "Olá! Vim pelo site PJ Presentes & Variedades e gostaria de mais informações.";

export function WhatsAppButton() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const text = encodeURIComponent(MESSAGE);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    // No celular: abre direto o app (whatsapp://). No desktop: WhatsApp Web.
    const url = isMobile
      ? `whatsapp://send?phone=${PHONE}&text=${text}`
      : `https://web.whatsapp.com/send?phone=${PHONE}&text=${text}`;
    // Fallback universal caso o app não esteja instalado
    const fallback = `https://wa.me/${PHONE}?text=${text}`;

    const win = window.open(url, "_blank");
    setTimeout(() => {
      if (!win || win.closed) window.location.href = fallback;
    }, 600);
  };

  return (
    <a
      href={`https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`}
      onClick={handleClick}
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

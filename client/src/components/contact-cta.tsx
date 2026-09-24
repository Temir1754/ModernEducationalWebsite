import { Phone } from "lucide-react";

// "Any questions?" call-to-action with the school phone, shown at the end of content pages
export default function ContactCta({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="mb-2 text-2xl font-extrabold uppercase tracking-wide text-[#24806A] md:text-3xl">
        Сізде сұрақтар бар ма?
      </h2>
      <p className="mb-8 text-base font-bold text-gray-900 dark:text-gray-100 sm:text-lg">
        Бізбен байланысыңыз, біз оларға қуана жауап береміз
      </p>
      <a href="tel:+77757906363" className="group inline-flex items-center gap-4">
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <span className="absolute inset-0 scale-125 rounded-full border-2 border-[#F2A63B] transition-transform duration-300 group-hover:scale-150" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#24806A] text-white">
            <Phone className="h-5 w-5" />
          </span>
        </span>
        <span className="text-lg font-extrabold uppercase tracking-wide text-[#2A4A46] dark:text-gray-100">
          Байланысу
        </span>
      </a>
    </div>
  );
}

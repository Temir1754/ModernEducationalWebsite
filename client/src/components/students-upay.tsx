import { Apple, Check, Globe, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const links = [
  {
    label: "Веб-нұсқасы",
    href: "https://upay-edu.kz/app/login",
    Icon: Globe,
    buttonClass: "bg-[#24806A] text-white hover:bg-[#1d6b58]",
    testId: "link-upay-web",
  },
  {
    label: "Android қолданбасы",
    href: "https://play.google.com/store/apps/details?id=kz.saruar.shyrsha",
    Icon: Smartphone,
    buttonClass: "bg-[#2A4A46] text-white hover:bg-[#223c39]",
    testId: "link-upay-android",
  },
  {
    label: "iOS қолданбасы",
    href: "https://apps.apple.com/us/app/%D2%B1%D0%BF%D0%B0%D0%B9-%C5%ABpay/id6741690963",
    Icon: Apple,
    buttonClass: "border-2 border-[#2A4A46] bg-white text-[#2A4A46] hover:bg-gray-50",
    testId: "link-upay-ios",
  },
];

const features = [
  "Тесттер мен директорлық бақылау арқылы ұпай жинаңыз.",
  "Ойын ойнап, марапат алыңыз.",
  "Ұпаймен аукциондарға қатысыңыз және мектеп ішінде сыйлықтар алыңыз.",
];

// UPay: the school virtual currency, with app links and QR codes
export default function StudentsUpay() {
  return (
    <section id="upay" className="scroll-mt-24 rounded-[2rem] bg-[#F7F7F5] p-6 dark:bg-[#131722] sm:p-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#24806A]">UPay жүйесі</p>
          <h2 className="font-heading text-3xl font-extrabold leading-tight text-[#2A4A46] dark:text-gray-100 md:text-4xl">
            Мектептің виртуалды экономикасы
          </h2>
          <div className="my-6 h-[3px] w-40 bg-gradient-to-r from-[#F2A63B] to-transparent" />
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            UPay – білімді ойынмен ұштастыратын мектептің жаңа цифрлық жүйесі. Оқушылар енді өз білімдері мен белсенділіктері үшін Ұpay валютасын таба алады!
          </p>
          <ul className="mb-8 space-y-3">
            {features.map((text) => (
              <li key={text} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F2A63B]/20 text-[#c97f16]">
                  <Check className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {links.map(({ label, href, Icon, buttonClass, testId }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={testId}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors ${buttonClass}`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-[#1e293b] dark:ring-gray-700">
          <p className="mb-6 text-center font-heading text-lg font-bold text-[#2A4A46] dark:text-gray-100">
            QR-коды арқылы жылдам қосылу
          </p>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {links.map(({ label, href, Icon }) => (
              <div key={href} className="flex flex-col items-center gap-2">
                <div className="rounded-xl border-2 border-[#24806A]/30 bg-white p-1.5 sm:p-3">
                  <QRCodeSVG value={href} size={150} level="H" className="h-auto w-full max-w-[150px]" />
                </div>
                <p className="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-200 sm:text-sm">
                  <Icon className="hidden h-4 w-4 sm:block" />
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-gray-500 dark:text-gray-400">
            Телефонның камерасын QR-кодқа қаратып, тікелей сілтемені ашыңыз
          </p>
        </div>
      </div>
    </section>
  );
}

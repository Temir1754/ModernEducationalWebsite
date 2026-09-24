import { Link } from "wouter";
import { Clock, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    {
      href: "https://www.instagram.com/fgs.schoolkz/",
      Icon: FaInstagram,
      label: "Instagram",
      className: "text-pink-600",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = 'instagram://user?username=fgs.schoolkz';
        setTimeout(() => {
          window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
        }, 1000);
      }
    },
    {
      href: "#",
      Icon: FaTelegramPlane,
      label: "Telegram",
      className: "text-sky-500",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/bilimdi_urpaq):');
        if (telegramLink) {
          const username = telegramLink.replace('https://t.me/', '');
          window.location.href = `tg://resolve?domain=${username}`;
          setTimeout(() => {
            window.open(telegramLink, '_blank');
          }, 1000);
        }
      }
    },
    {
      href: "https://wa.me/77757906363",
      Icon: FaWhatsapp,
      label: "WhatsApp",
      className: "text-green-600",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = 'whatsapp://send?phone=77757906363';
        setTimeout(() => {
          window.open('https://wa.me/77757906363', '_blank');
        }, 1000);
      }
    },
    {
      href: "https://www.facebook.com/people/Bilimdi-Urpaq-School/pfbid0b3bkVb2Vz1B59RdK3PfLQR7DcKwJ92XaxfMXdB5kK7wv1AwTBBUbtUZ5uj1oAN7ul/",
      Icon: FaFacebookF,
      label: "Facebook",
      className: "text-blue-600",
    },
  ];

  const schoolLinks = [
    { href: "/about-school", label: "Мектеп туралы" },
    { href: "/administration", label: "Әкімшілік құрамы" },
    { href: "/gallery", label: "Фотогалерея" },
    { href: "/events", label: "Іс-шаралар" },
  ];

  const serviceLinks = [
    { href: "/education-process", label: "Оқу үдерісі" },
    { href: "/upbringing-work", label: "Мектеп тынысы" },
    { href: "/kruzhki", label: "Үйірмелер" },
    { href: "/canteen", label: "Асхана" },
  ];

  const linkClass =
    "inline-block text-slate-600 hover:text-primary hover:translate-x-1 transition-all duration-200";
  const contactIconClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary";

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-800">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div className="col-span-2 space-y-6 lg:col-span-1">
            <Link href="/">
              <img
                src="/logo-wide.webp"
                alt="Білімді ұрпақ жекеменшік мектебі"
                width={220}
                height={68}
                className="h-16 w-auto object-contain cursor-pointer"
              />
            </Link>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ href, Icon, label, className, onClick }) => (
                <a
                  key={label}
                  href={href}
                  onClick={onClick}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
                >
                  <Icon className={`h-[18px] w-[18px] ${className}`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-5">Мектеп</h4>
            <ul className="space-y-3">
              {schoolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold mb-5">Қызметтер</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-base font-semibold mb-5">Байланыс</h4>
            <ul className="space-y-4 text-slate-600">
              <li>
                <a
                  href="https://go.2gis.com/DoFle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary transition-colors duration-200"
                >
                  <span className={contactIconClass}>
                    <MapPin className="h-4 w-4" />
                  </span>
                  Өтегенов 43А, Шымкент
                </a>
              </li>
              <li>
                <a
                  href="tel:+77757906363"
                  className="flex items-center gap-3 hover:text-primary transition-colors duration-200"
                >
                  <span className={contactIconClass}>
                    <Phone className="h-4 w-4" />
                  </span>
                  +7 775 790 63 63
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className={contactIconClass}>
                  <Clock className="h-4 w-4" />
                </span>
                Дүйсенбі – жұма: 08:00 – 18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Білімді ұрпақ жекеменшік мектебі. Барлық құқықтар сақталған.</p>
        </div>
      </div>
    </footer>
  );
}

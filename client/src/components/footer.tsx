import { Link } from "wouter";

export default function Footer() {
  const socialLinks = [
    {
      href: "https://www.instagram.com/fgs.schoolkz/",
      icon: "fab fa-instagram",
      className: "text-pink-400 hover:text-pink-500 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Try to open Instagram app first, fallback to web
        window.location.href = 'instagram://user?username=fgs.schoolkz';
        setTimeout(() => {
          window.open('https://www.instagram.com/fgs.schoolkz/', '_blank');
        }, 1000);
      }
    },
    {
      href: "#",
      icon: "fab fa-telegram",
      className: "text-blue-400 hover:text-blue-500 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Ask user for Telegram channel/group link
        const telegramLink = prompt('Телеграм каналы немесе топ сілтемесін енгізіңіз (мысалы: https://t.me/fgs_school):');
        if (telegramLink) {
          // Extract username from link and try app first
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
      icon: "fab fa-whatsapp",
      className: "text-green-400 hover:text-green-500 transform hover:scale-110 transition-all duration-200",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // Try to open WhatsApp app first, fallback to web
        window.location.href = 'whatsapp://send?phone=77757906363';
        setTimeout(() => {
          window.open('https://wa.me/77757906363', '_blank');
        }, 1000);
      }
    },
    {
      href: "https://www.facebook.com/people/Fgs-School/pfbid0b3bkVb2Vz1B59RdK3PfLQR7DcKwJ92XaxfMXdB5kK7wv1AwTBBUbtUZ5uj1oAN7ul/",
      icon: "fab fa-facebook-f",
      className: "text-blue-400 hover:text-blue-500 transform hover:scale-110 transition-all duration-200",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white rounded-lg p-2 mr-3">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-bold">FGS</h3>
                <p className="text-sm text-gray-300">Болашақ ұрпақ мектебі</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Балаларыңыздың болашағына инвестиция жасау үшін дұрыс таңдау - FGS мектебі.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={link.className}
                  onClick={link.onClick}
                >
                  <i className={`${link.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          <div>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about-school" className="hover:text-white">
                  Мектеп туралы
                </Link>
              </li>
              <li>
                <Link href="/administration" className="hover:text-white">
                  Әкімшілік құрамы
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">
                  Фотогалерея
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Іс-шаралар
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Қызметтер</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/education-process" className="hover:text-white">
                  Оқу үдерісі
                </Link>
              </li>
              <li>
                <Link href="/upbringing-work" className="hover:text-white">
                  Мектеп тынысы
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">
                  Галерея
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white">
                  Іс-шаралар
                </Link>
              </li>
              <li>
                <Link href="/kruzhki" className="hover:text-white">
                  Үйірмелер
                </Link>
              </li>
              <li>
                <Link href="/canteen" className="hover:text-white">
                  Асхана
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Байланыс</h4>
            <div className="space-y-2 text-gray-300">
              <button
                onClick={() => window.open('https://go.2gis.com/DoFle', '_blank')}
                className="flex items-center hover:text-white transition-colors duration-200 text-left"
              >
                <i className="fas fa-map-marker-alt mr-2"></i>
                Өтегенов 43А, Шымкент
              </button>
              <button
                onClick={() => window.location.href = 'tel:+77757906363'}
                className="flex items-center hover:text-white transition-colors duration-200 text-left"
              >
                <i className="fas fa-phone mr-2"></i>
                +7‒775‒790‒63‒63
              </button>
              <p>
                <i className="fas fa-clock mr-2"></i>
                Дүйсенбі - жұма: 08:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 FGS - Болашақ ұрпақ мектебі. Барлық құқықтар сақталған.</p>
        </div>
      </div>
    </footer>
  );
}

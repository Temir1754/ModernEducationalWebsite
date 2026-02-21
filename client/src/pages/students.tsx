import SEOHead from "@/components/seo-head";
import { Link } from "wouter";
import { Users, Award, BookOpen, Trophy, Calendar, GraduationCap, ArrowLeft, Clock, Coins, Smartphone, Globe, Apple } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function StudentsPage() {
  // ========================================
  // ИЗМЕНИТЬ ДИАПАЗОН КОЛИЧЕСТВА ДЕТЕЙ В КЛАССЕ
  // Текущее значение: 12-18
  // Чтобы изменить, замените "12-18" на новое значение (например, "10-15", "15-20")
  // ========================================
  const studentStats = [
    { number: "180+", label: "Оқушылар саны", icon: Users },
    { number: "0-9", label: "Сынып деңгейлері", icon: GraduationCap },
    { number: "12-18", label: "Сыныптағы оқушылар", icon: BookOpen },
    { number: "95%", label: "Табысты бітірушілер", icon: Award }
  ];

  const activities = [
    {
      title: "Ғылыми жобалар",
      description: "Оқушылар өз ғылыми зерттеулерін жүргізеді",
      icon: BookOpen
    },
    {
      title: "Спорт секциялары",
      description: "Футбол, таэквандо, секциялары",
      icon: Trophy
    },
    {
      title: "Шығармашылық үйірмелер",
      description: "Сурет, музыка, би үйірмелері",
      icon: Calendar
    },
    {
      title: "Олимпиадалар",
      description: "Әртүрлі пән олимпиадаларына қатысу",
      icon: Award
    }
  ];

  const achievements = [
    "Облыстық олимпиадада 15 жүлдегер",
    "Республикалық конкурстарда призёрлар",
    "100% оқушылар жоғары оқу орындарына түсті",
    "Халықаралық жобаларға қатысу"
  ];

  return (
    <>
      <SEOHead page="students" />

      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {/* Header with Back Button - Enhanced for mobile */}
        <div className="bg-white dark:bg-[#1e293b] shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Басты бетке оралу</span>
                <span className="sm:hidden">Басты бет</span>
              </Link>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Оқушылар</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="text-center mb-6">
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Біздің мектебіміздің оқушылары - болашағымыздың негізі. Олар білім алумен қатар 
              өз дарындылықтарын дамытады және жетістіктерге жетеді.
            </p>
          </div>

          {/* UPay System Section */}
          <div id="upay" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-center mb-6">
              <Coins className="w-12 h-12 text-yellow-500 dark:text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                💰 UPay жүйесі – мектептің виртуалды экономикасы!
              </h2>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6 leading-relaxed">
              Оқушылар енді өз білімдері мен белсенділіктері үшін Ұpay валютасын таба алады!
            </p>

            <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 mb-6 shadow-md border dark:border-gray-700">
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-xl">🔸</span>
                  <span>Тесттер мен директорлық бақылау арқылы ұпай жинаңыз.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-xl">🔸</span>
                  <span>Ойын ойнап, марапат алыңыз.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-xl">🔸</span>
                  <span>Ұпаймен аукциондарға қатысыңыз және мектеп ішінде сыйлықтар алыңыз.</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <a
                href="https://upay-edu.kz/app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="link-upay-web"
              >
                <Globe className="w-6 h-6" />
                <span>🌐 Веб-нұсқасы</span>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=kz.saruar.shyrsha"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="link-upay-android"
              >
                <Smartphone className="w-6 h-6" />
                <span>📱 Android қолданбасы</span>
              </a>

              <a
                href="https://apps.apple.com/us/app/%D2%B1%D0%BF%D0%B0%D0%B9-%C5%ABpay/id6741690963"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="link-upay-ios"
              >
                <Apple className="w-6 h-6" />
                <span>🍎 iOS қолданбасы</span>
              </a>
            </div>

            {/* QR Codes Section */}
            <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 mb-6 shadow-md border dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-6">
                📱 QR-коды арқылы жылдам қосылу
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                    <QRCodeSVG
                      value="https://upay-edu.kz/app/login"
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">🌐 Веб-нұсқасы</p>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
                    <QRCodeSVG
                      value="https://play.google.com/store/apps/details?id=kz.saruar.shyrsha"
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">📱 Android қолданбасы</p>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600">
                    <QRCodeSVG
                      value="https://apps.apple.com/us/app/%D2%B1%D0%BF%D0%B0%D0%B9-%C5%ABpay/id6741690963"
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">🍎 iOS қолданбасы</p>
                </div>
              </div>
              <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-4">
                Телефонның камерасын QR-кодқа қаратып, тікелей сілтемені ашыңыз
              </p>
            </div>

            <p className="text-center text-gray-500 dark:text-gray-400 text-sm italic">
              UPay – білімді ойынмен ұштастыратын мектептің жаңа цифрлық жүйесі
            </p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {studentStats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border dark:border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Activities Section */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Оқушылардың қызметі
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity, index) => (
                <div key={index} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-gray-700">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <activity.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Link Card */}
          <Link href="/schedule">
            <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105" data-testid="link-schedule">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <Clock className="w-12 h-12" />
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Сабақ кестесі</h3>
                    <p className="text-blue-100 dark:text-blue-200">Сабақ уақыттары және үйірмелер кестесі</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 transform rotate-180" />
              </div>
            </div>
          </Link>

          {/* Achievements Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Оқушылардың жетістіктері
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Life Section */}
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
              Оқушылардың күнделікті өмірі
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Білім беру процесі
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Заманауи оқыту әдістемелері</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Топтық және жеке жұмыс</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Жеке дарындылықты дамыту</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Қосымша дайындық сабақтары</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Біздің мақтанышымыз
                </h3>
                <p className="text-blue-100 dark:text-blue-200 leading-relaxed">
                  Әрбір оқушымыз бізге үлкен мақтаныш әкеледі. Олардың білімге құштарлығы, 
                  белсенділігі және жетістіктері мектебіміздің беделін арттырады.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
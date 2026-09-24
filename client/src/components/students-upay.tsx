import { Coins, Globe, Smartphone, Apple } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// UPay: the school virtual currency, with app links and QR codes (restored from the original students page)
export default function StudentsUpay() {
  return (
    <div id="upay" className="scroll-mt-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-8 border border-blue-100 dark:border-gray-700">
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
          className="flex items-center justify-center space-x-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-black font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
  );
}

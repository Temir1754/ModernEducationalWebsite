import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SubjectTeachersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Top Contact Bar - Fixed/Sticky */}
      <section className="fixed top-0 left-0 md:left-64 right-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-4 z-50 shadow-sm border-b border-blue-500/20 dark:border-blue-700/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-end md:space-x-6">
            {/* Phone Number - positioned first */}
            <button 
              className="flex items-center hover:bg-blue-500/30 transition-colors duration-200 rounded px-2 py-1"
              onClick={() => window.location.href = 'tel:+77757906363'}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">+7‒775‒790‒63‒63</span>
            </button>
            
            {/* Working Hours - positioned closer to social icons */}
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Жұмыс уақыты: 08:00 - 18:00</span>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="https://go.2gis.com/DoFle"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500/30 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="2GIS"
              >
                <span className="text-xs font-bold text-white">2G</span>
              </a>
              
              <a
                href="https://www.instagram.com/fgs.schoolkz/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500/30 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="Instagram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a
                href="https://t.me/fgs_school"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500/30 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="Telegram"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              
              <a
                href="https://wa.me/77757906363"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-500/30 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-colors duration-200"
                title="WhatsApp"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 py-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="outline" className="mr-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Басты бетке қайту
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Пән мұғалімдері
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Әртүрлі пәндер бойынша мамандандырылған тәжірибелі мұғалімдер
            </p>
          </div>
        </div>
      </section>

      {/* About Subject Teachers Section - Moved to top */}
      <section className="py-12 bg-white dark:bg-[#1e293b] pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 border dark:border-gray-700">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Пән мұғалімдері туралы
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                  Пән мұғалімдеріміз өз салаларында терең білімге және үлкен тәжірибеге ие. 
                  Олар заманауи технологияларды пайдалана отырып, балаларға сапалы білім беруге тырысады. 
                  Әрбір мұғалім өз пәнін қызықты және түсінікті етіп жеткізе алады.
                </p>
                <div className="mt-6">
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    Мұғалімдердің фотосуреттері жақын арада қосылады
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16 bg-gray-50 dark:bg-[#0f172a]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Махат Сырға Заханқызы
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                        Математика
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Сұлтанбек Дана Мақсұтханқызы
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                        Қазақ тілі
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Шадиева Дидара Сарсенбайқызы
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                        Ағылшын тілі
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Кенджабаева Аружан Гапбарқызы
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs px-2 py-1 rounded-full">
                        Физика
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Оспабаева Айгуль Турдалиевна
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 text-xs px-2 py-1 rounded-full">
                        Биология
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border dark:border-gray-700">
                <div className="flex items-center">
                  <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-chalkboard-teacher text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      Юзыкаев Жасулан Серикбайулы
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">Пән мұғалімі</p>
                    <div className="mt-2">
                      <span className="inline-block bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-xs px-2 py-1 rounded-full">
                        Дене шынықтыру
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>
    </div>
  );
}
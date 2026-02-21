
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

// Teacher data structure
interface Teacher {
  name: string;
  subject: string;
  category: string;
  color: string;
}

export default function PrimaryTeachersPage() {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>("Барлығы");

  // Complete teachers data
  const teachersData: Teacher[] = [
    // Бастауыш сынып мұғалімдері
    { name: "Абжанова Шарапат Молдахановна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "blue" },
    { name: "Абильдаева Шолпан Касымбековна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "green" },
    { name: "Жаксылыкова Альфиса Алпысбаевна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "purple" },
    { name: "Карабекова Лазиза Усербаевна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "orange" },
    { name: "Поливина Татьяна Викторовна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "pink" },
    { name: "Шопанова Роза Жакипжановна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "teal" },
    { name: "Татенбекова Роза Тансыбековна", subject: "Бастауыш сынып", category: "Бастауыш сынып", color: "indigo" },
    
    // Қазақ тілі
    { name: "Файзуллаева Балжан Аманбаевна", subject: "Қазақ тілі", category: "Қазақ тілі", color: "emerald" },
    { name: "Тулеева Карлыгаш Шамшиковна", subject: "Қазақ тілі", category: "Қазақ тілі", color: "green" },
    { name: "Төленді Сабина Болатқызы", subject: "Қазақ тілі", category: "Қазақ тілі", color: "teal" },

    // Орыс тілі
    { name: "Ибрагимова Оимхон Малихановна", subject: "Орыс тілі", category: "Орыс тілі", color: "red" },
    { name: "Махат Сырға Заханқызы", subject: "Орыс тілі", category: "Орыс тілі", color: "rose" },

    // Математика
    { name: "Сабырова Гүлнұр Құрманғазықызы", subject: "Математика", category: "Математика", color: "blue" },
    { name: "Дарабаева Дана Сериковна", subject: "Математика", category: "Математика", color: "indigo" },
    { name: "Шадиева Дидара Сарсенбайқызы", subject: "Математика", category: "Математика", color: "cyan" },

    // Ағылшын тілі
    { name: "Пернебек Камилла Даулеткерейқызы", subject: "Ағылшын тілі", category: "Ағылшын тілі", color: "violet" },
    { name: "Романқұл Салтанат", subject: "Ағылшын тілі", category: "Ағылшын тілі", color: "purple" },
    { name: "Нұрланқызы Жанеля", subject: "Ағылшын тілі", category: "Ағылшын тілі", color: "fuchsia" },
    { name: "Тастанбекова Нурайым Асетовна", subject: "Ағылшын тілі", category: "Ағылшын тілі", color: "pink" },

    // Тарих
    { name: "Зинадилова Раушан Калдыбековна", subject: "Тарих", category: "Тарих", color: "amber" },
    { name: "Артықбаева Матлюба Фархатовна", subject: "Тарих", category: "Тарих", color: "yellow" },

    // География
    { name: "Артыкбаева Матлюба Фархатовна", subject: "География", category: "География", color: "lime" },
    { name: "Базарбаева Енлик Ерлановна", subject: "География", category: "География", color: "green" },

    // Денешынықтыру
    { name: "Насурлаев Бауыржан Ташабаевич", subject: "Денешынықтыру", category: "Спорт", color: "orange" },
    { name: "Абдреев Жасулан Жанбулатович", subject: "Денешынықтыру", category: "Спорт", color: "red" },
    { name: "Байшоинова Сания Тузельбаевна", subject: "Спорт", category: "Спорт", color: "emerald" },

    // Ғылымдар
    { name: "Кенджабаева Аружан Гапбарқызы", subject: "Физика", category: "Ғылымдар", color: "slate" },
    { name: "Наханова Гулим Умыркуловна", subject: "Биология, химия", category: "Ғылымдар", color: "stone" },

    // Өнер және қосымша пәндер
    { name: "Амирбекова Райхан Ерназаровна", subject: "Бейнелеу өнері", category: "Өнер", color: "pink" },
    { name: "Сейілхан Мағжан Есімханұлы", subject: "Музыка", category: "Өнер", color: "purple" },
    { name: "Аманбек Жансая Тимурханқызы", subject: "Көркем еңбек", category: "Өнер", color: "violet" },
    { name: "Бекетай Гүлнұр Бекмұрзақызы", subject: "Көркем еңбек", category: "Өнер", color: "fuchsia" },

    // Информатика
    { name: "Ускенбаева Сая Жоланбаевна", subject: "Информатика", category: "Информатика", color: "gray" },
    { name: "Есмурзаев Нурсултан Жетписханович", subject: "Информатика", category: "Информатика", color: "zinc" },

    // Басқа пәндер
    { name: "Есмурзааева Майра Бакбергеновна", subject: "Логикалық математика", category: "Математика", color: "sky" },
    { name: "Калаубаева Жанар Турехановна", subject: "Дайындық топ", category: "Дайындық", color: "blue" },
  ];

  // Filter options
  const filterOptions = [
    "Барлығы",
    "Бастауыш сынып",
    "Қазақ тілі",
    "Орыс тілі", 
    "Математика",
    "Ағылшын тілі",
    "Тарих",
    "География",
    "Спорт",
    "Ғылымдар",
    "Өнер",
    "Информатика",
    "Дайындық"
  ];

  // Filter teachers based on selected category
  const filteredTeachers = selectedFilter === "Барлығы" 
    ? teachersData 
    : teachersData.filter(teacher => teacher.category === selectedFilter);

  // Color mapping for consistent styling
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      pink: "bg-pink-100 text-pink-600",
      teal: "bg-teal-100 text-teal-600",
      indigo: "bg-indigo-100 text-indigo-600",
      emerald: "bg-emerald-100 text-emerald-600",
      red: "bg-red-100 text-red-600",
      rose: "bg-rose-100 text-rose-600",
      cyan: "bg-cyan-100 text-cyan-600",
      violet: "bg-violet-100 text-violet-600",
      fuchsia: "bg-fuchsia-100 text-fuchsia-600",
      amber: "bg-amber-100 text-amber-600",
      yellow: "bg-yellow-100 text-yellow-600",
      lime: "bg-lime-100 text-lime-600",
      slate: "bg-slate-100 text-slate-600",
      stone: "bg-stone-100 text-stone-600",
      gray: "bg-gray-100 text-gray-600",
      zinc: "bg-zinc-100 text-zinc-600",
      sky: "bg-sky-100 text-sky-600"
    };
    return colorMap[color] || "bg-blue-100 text-blue-600";
  };

  const getTagColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
      pink: "bg-pink-100 text-pink-800",
      teal: "bg-teal-100 text-teal-800",
      indigo: "bg-indigo-100 text-indigo-800",
      emerald: "bg-emerald-100 text-emerald-800",
      red: "bg-red-100 text-red-800",
      rose: "bg-rose-100 text-rose-800",
      cyan: "bg-cyan-100 text-cyan-800",
      violet: "bg-violet-100 text-violet-800",
      fuchsia: "bg-fuchsia-100 text-fuchsia-800",
      amber: "bg-amber-100 text-amber-800",
      yellow: "bg-yellow-100 text-yellow-800",
      lime: "bg-lime-100 text-lime-800",
      slate: "bg-slate-100 text-slate-800",
      stone: "bg-stone-100 text-stone-800",
      gray: "bg-gray-100 text-gray-800",
      zinc: "bg-zinc-100 text-zinc-800",
      sky: "bg-sky-100 text-sky-800"
    };
    return colorMap[color] || "bg-blue-100 text-blue-800";
  };
  return (
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
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Бастауыш сынып мұғалімдері</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
        {/* About Our Team Section */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border dark:border-gray-700">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  Біздің педагогикалық команда
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
                  FGS мектебінің мұғалімдері - бұл жоғары білікті, тәжірибелі және заманауи 
                  білім беру әдістерін қолданатын мамандар. Олар балалардың жеке дамуына және 
                  білімге деген құштарлығын арттыруға ұмтылады.
                </p>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    <Filter className="w-4 h-4 mr-1" />
                    Барлығы {teachersData.length} мұғалім
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  data-testid={`filter-${option.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedFilter(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFilter === option
                      ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-md transform scale-105'
                      : 'bg-white dark:bg-[#1e293b] text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow-md border dark:border-gray-700'
                  }`}
                >
                  {option}
                  {option !== "Барлығы" && (
                    <span className="ml-1 text-xs opacity-75">
                      ({teachersData.filter(t => t.category === option).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Active filter indicator */}
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {selectedFilter === "Барлығы" 
                  ? `Барлық мұғалімдер көрсетілуде (${filteredTeachers.length})` 
                  : `${selectedFilter} бойынша: ${filteredTeachers.length} мұғалім`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Filter className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Мұғалімдер табылмады
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Таңдалған санат бойынша мұғалімдер жоқ
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher, index) => (
                  <div 
                    key={index}
                    data-testid={`teacher-card-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-white dark:bg-[#1e293b] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${getColorClasses(teacher.color)}`}>
                        <i className="fas fa-chalkboard-teacher text-2xl"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 leading-tight">
                          {teacher.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">Пән мұғалімі</p>
                        <div className="mt-2">
                          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getTagColorClasses(teacher.color)}`}>
                            {teacher.subject}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Statistics Footer */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-6 border dark:border-gray-700">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  Мұғалімдер статистикасы
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {teachersData.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Барлық мұғалімдер</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {filterOptions.length - 1}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Пән бағыттары</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {filteredTeachers.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Көрсетілуде</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      100%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Білікті</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
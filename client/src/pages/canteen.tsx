import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useState } from "react";
import { 
  Utensils, 
  Clock, 
  DollarSign, 
  Shield, 
  Phone, 
  Mail, 
  Camera, 
  Apple, 
  Users, 
  MessageSquare,
  ChefHat,
  Heart,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";

const CanteenPage = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);

  // 4 weeks menu data
  const menuByWeek = {
    1: [
      {
        day: "Дүйсенбі",
        breakfast: "Манка ботқасы чиа тұқымдарымен (200/250гр), Печенье (30гр), Жылы су (200гр)",
        lunch: "Үй пельменьдері (200/250гр), Витаминдік котлета (200/250гр), Жазғы салат (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Жылы жүрек булочкасы, Нәзік тәттілік йогурты"
      },
      {
        day: "Сейсенбі",
        breakfast: "Батырлар кашасы (сүлі каша чиа тұқымдарымен) (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Алтын сорпа (бұршақ сорпасы) (200/250гр), Ет пен картоппен запеканка (150/200гр), Радуга салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Қамырдағы сосиска, Какао"
      },
      {
        day: "Сәрсенбі",
        breakfast: "Болгар бұрышымен омлет (200/250гр), Жылы су (200гр)",
        lunch: "Рассольник сорпасы (200/250гр), Лагман (150/200гр), Марковча салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Шарлотка пирогы, Компот"
      },
      {
        day: "Бейсенбі",
        breakfast: "5 дәнді каша чиа тұқымдарымен (200/250гр), Ірімшікті бутерброд (30гр), Жылы су (200гр)",
        lunch: "Жұлдызша сорпасы (200/250гр), Күркетауық еті мен нохат плов (150/200гр), 'Жаңа' салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Ірімшікті лепешка, Каркаде шәйі"
      },
      {
        day: "Жұма",
        breakfast: "Күріш кашасы (200/250гр), Ірімшікті бутерброд (30гр), Жылы су (200гр)",
        lunch: "Үй кеспесі сорпасы (200/250гр), Томатты соуста тефтелі гарнирмен (200/250гр), Витаминка салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Тарқынды Ертегі булочкалары, Алма, Компот"
      }
    ],
    2: [
      {
        day: "Дүйсенбі",
        breakfast: "Манка ботқасы чиа тұқымдарымен (200/250гр), Печенье (30гр), Жылы су (200гр)",
        lunch: "Машевый сорпасы (250/300гр), Балоньез пастасы (150/200гр), Жеңіл салат (60/100гр), Нан себеті, Жылы су (200гр)",
        snack: "Көкпен булочкалар, Йогурт"
      },
      {
        day: "Сейсенбі",
        breakfast: "5 дәнді каша (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Фасоль сорпасы (250/300гр), Көкөніс рагу (150/200гр), Марковча салаты (60/100гр), Нан себеті, Жылы су (200гр)",
        snack: "Майонезсіз пицца, Какао"
      },
      {
        day: "Сәрсенбі",
        breakfast: "Қарақұмық кашасы (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Жасымық сорпасы (250/300гр), Құс етінен котлеттер (150/200гр), Витаминдік салат (60/100гр), Нан себеті, Жылы су (200гр)",
        snack: "Джемді булочка, Компот"
      },
      {
        day: "Бейсенбі",
        breakfast: "Сүлі каша чиа тұқымдарымен (200/250гр), Жұмыртқа (30гр), Жылы су (200гр)",
        lunch: "Бұршақ сорпасы (200/250гр), Күркетауық еті мен нохат плов (200/250гр), Жаңа салат (60/100гр), Нан себеті, Жылы су (200гр)",
        snack: "Картоппен пісірілген пирожок, Каркаде шәйі"
      },
      {
        day: "Жұма",
        breakfast: "Күріш кашасы (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Борщ сорпасы (250/300гр), Маусымдық көкөністермен лагман (150/200гр), Шұғынды салат (60/100гр), Нан себеті, Жылы су (200гр)",
        snack: "Қайнатылған сүтті булочка, Алма, Жылы су"
      }
    ],
    3: [
      {
        day: "Дүйсенбі",
        breakfast: "Манка ботқасы чиа тұқымдарымен (200/250гр), Печенье (30гр), Жылы су (200гр)",
        lunch: "Үй лапшасы (250/300гр), Қайыққа күріш (200/250гр), Витаминка салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Джемді булочкалар, Йогурт"
      },
      {
        day: "Сейсенбі",
        breakfast: "5 дәнді каша чиа тұқымдарымен (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Жұлдызша сорпасы (250/300гр), Етпен фрикадельки (200/250гр), Жазғы салат (60/100гр), Нан себеті, Итмұрын шәйі (200гр)",
        snack: "Ірімшікті лепешкалар, Компот"
      },
      {
        day: "Сәрсенбі",
        breakfast: "Тары кашасы чиа тұқымдарымен (250/300гр), Жұмыртқа (30гр), Жылы су (200гр)",
        lunch: "Рассольник сорпасы (250/300гр), Брынза мен шпинатпен грек пирогы (150/200гр), Қырыққабат пен қияр салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Ватрушкалар, Компот"
      },
      {
        day: "Бейсенбі",
        breakfast: "Қарақұмық кашасы (250/300гр), Ірімшікті бутерброд (30гр), Жылы су (200гр)",
        lunch: "Манпар сорпасы (250/300гр), Күркетауық еті мен нохат плов (150/200гр), Жаңа салат (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Қамырдағы сосиска, Каркаде шәйі"
      },
      {
        day: "Жұма",
        breakfast: "Күріш кашасы чиа тұқымдарымен (200/250гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Жасымық сорпасы (250/300гр), Қайыққа пюре (150/200гр), Винегрет салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Тарқынды булочкалар, Алма, Какао"
      }
    ],
    4: [
      {
        day: "Дүйсенбі",
        breakfast: "Манды каша чиа тұқымдарымен (150/200гр), Печенье (30гр), Жылы су (200гр)",
        lunch: "Бұршақ сорпасы (200/250гр), Қайыққа күріш (150/200гр), Жазғы салат (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Булочка, Йогурт"
      },
      {
        day: "Сейсенбі",
        breakfast: "Болгар бұрышымен омлет (150/200гр), Жылы су (200гр)",
        lunch: "Машевый сорпасы (200/250гр), Брокколи мен сиыр етімен гратен (150/200гр), Жеңіл салат (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Майонезсіз пицца, Каркаде шәйі"
      },
      {
        day: "Сәрсенбі",
        breakfast: "Тары кашасы (150/200гр), Ірімшікті бутерброд (30гр), Жылы су (200гр)",
        lunch: "Күрішті сорпа (200/250гр), Жаркөп (150/200гр), Шұғынды салат (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Тарқынды булочкалар, Компот"
      },
      {
        day: "Бейсенбі",
        breakfast: "5 дәнді каша чиа тұқымдарымен (150/200гр), Жұмыртқа (30гр), Жылы су (200гр)",
        lunch: "Борщ сорпасы (200/250гр), Күркетауық еті мен нохат плов (150/200гр), Қышқыл қырыққабат салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Ватрушка, Какао"
      },
      {
        day: "Жұма",
        breakfast: "Күріш кашасы чиа тұқымдарымен (150/200гр), Майлы бутерброд (30гр), Жылы су (200гр)",
        lunch: "Минестроне сорпасы (200/250гр), Үй лагманы (150/200гр), Винегрет салаты (60/100гр), Нан себеті, Компот (200гр)",
        snack: "Булочка, Алма, Компот"
      }
    ]
  };

  const weeklyMenu = menuByWeek[selectedWeek as keyof typeof menuByWeek];

  // FAQ data
  const faqData = [
    {
      question: "Өз тамағын алып келуге бола ма?",
      answer: "Иә, бірақ алдын ала мұғалімге хабарлау керек. Үй тамағы санитарлық талаптарға сай болуы қажет."
    },
    {
      question: "Ет жемейтін балаларға қандай балама бар?",
      answer: "Біз вегетариандық мәзір ұсынамыз: көкөніс сорпалары, жеміс-көкөніс салаттары, сүт өнімдері."
    },
    {
      question: "Тамақтануға қалай жазылуға болады?",
      answer: "Мектеп кеңсесіне хабарласып, арнайы форманы толтыру керек. Ай басында төлем жасалады."
    },
    {
      question: "Аллергиясы бар балаларға қандай жағдай жасалған?",
      answer: "Медициналық анықтама негізінде жеке мәзір құрастырамыз. Ата-аналармен бірлесе отырып жұмыс істейміз."
    }
  ];

  return (
    <>
      <SEOHead page="home" />

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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Мектеп асханасы</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
          <div className="text-center mb-6">
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Оқушыларға дәмді әрі пайдалы тамақ беру арқылы олардың денсаулығы мен дамуын қамтамасыз етеміз
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-6">
            {/* Weekly Menu */}
            <Card className="lg:col-span-2 dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                    <ChefHat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <span>Апталық мәзір</span>
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map((week) => (
                      <Button
                        key={week}
                        onClick={() => setSelectedWeek(week)}
                        variant={selectedWeek === week ? "default" : "outline"}
                        size="sm"
                        className={`${
                          selectedWeek === week 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                        data-testid={`button-week-${week}`}
                      >
                        {week}-апта
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                {/* Mobile View - Stacked Cards */}
                <div className="block md:hidden space-y-4">
                  {weeklyMenu.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-4 border dark:border-gray-700">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3 text-center">{item.day}</h4>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-yellow-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Таңғы ас (08:30)</div>
                          <div className="text-sm dark:text-gray-400">{item.breakfast}</div>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-green-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Түскі ас (12:30)</div>
                          <div className="text-sm dark:text-gray-400">{item.lunch}</div>
                        </div>
                        <div className="bg-white dark:bg-[#1e293b] p-3 rounded border-l-4 border-blue-400">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Бесін ас (15:30)</div>
                          <div className="text-sm dark:text-gray-400">{item.snack}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 min-w-full">
                    <thead>
                      <tr className="bg-blue-50 dark:bg-blue-900/20">
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold whitespace-nowrap dark:text-gray-200">Күн</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold dark:text-gray-200">Таңғы ас (08:30)</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold dark:text-gray-200">Түскі ас (12:30)</th>
                        <th className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold dark:text-gray-200">Бесін ас (15:30)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyMenu.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="border border-gray-300 dark:border-gray-600 p-3 font-medium whitespace-nowrap dark:text-gray-200">{item.day}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm dark:text-gray-300">{item.breakfast}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm dark:text-gray-300">{item.lunch}</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-3 text-sm dark:text-gray-300">{item.snack}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Work Schedule */}
            <Card className="dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Жұмыс кестесі</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Таңғы ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">08:30 - 09:00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Түскі ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">12:30 - 13:30</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium dark:text-gray-200">Бесін ас</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">15:30 - 16:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photos Section */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Camera className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Асхана фотогалереясы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1567521464027-f127ff144326?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Асхана залы"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm font-medium">Асхана залы</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Тамақ дайындау"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm font-medium">Тамақ дайындау</p>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Дайын тағамдар"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm font-medium">Дайын тағамдар</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-6">
            {/* Sanitary Norms */}
            <Card className="dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Санитарлық нормалар</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Күнделікті температуралық бақылау</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Сертификатталған өнімдер ғана</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HACCP жүйесі бойынша жұмыс</span>
                  </li>
                  <li className="flex items-center space-x-3 text-gray-800 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Апта сайынғы лабораториялық тексеру</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="dark:bg-[#1e293b] dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>Жауапты қызметкер</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Амирова Айгүл Серікқызы</h4>
                    <p className="text-gray-600 dark:text-gray-300">Асхана жетекшісі</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-300">+7‒775‒790‒63‒63</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="dark:text-gray-300">canteen@fgs-school.kz</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Food Composition and Calories */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Apple className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Тағам құрамы мен калориялығы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">Витаминдер</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Витамин A, B, C, D</li>
                    <li>Кальций, темір</li>
                    <li>Фолий қышқылы</li>
                    <li>Омега-3 майлары</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-3">Калория</h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Таңғы ас: 400-450 ккал</li>
                    <li>Түскі ас: 600-700 ккал</li>
                    <li>Бесін ас: 200-250 ккал</li>
                    <li>Жалпы: 1200-1400 ккал</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Аллергендер
                  </h4>
                  <ul className="space-y-2 text-sm dark:text-gray-300">
                    <li>Сүт өнімдері</li>
                    <li>Глютен (бидай)</li>
                    <li>Жаңғақ</li>
                    <li>Жұмыртқа</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canteen Rules */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Асхана ережелері</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Балаларға арналған ережелер:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Алдымен қолды жуамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Дастархан басында тыныш отырамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Тамақты барлығымыз бірге ішеміз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Тамақ қалдықтарын қоқыс жәшігіне саламыз</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Қауіпсіздік ережелері:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Ыстық тағамға абай боламыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Аллергия туралы мұғалімге айтамыз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Асханада жүгірмейміз</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="dark:text-gray-300">Үлкендердің рұқсатынсыз ештеңе алмаймыз</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Жиі қойылатын сұрақтар</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqData.map((item, index) => (
                  <details key={index} className="group bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      {item.question}
                      <span className="transform group-open:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 text-gray-600 dark:text-gray-300">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* News and Announcements */}
          <Card className="mb-6 dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Жаңалықтар мен хабарламалар</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400">Жаңа мәзір</h4>
                  <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">1 қазаннан бастап күзгі мәзір енгізіледі</p>
                  <p className="text-blue-600 dark:text-blue-400 text-xs mt-2">28 қыркүйек 2025</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 dark:text-green-400">Органикалық өнімдер</h4>
                  <p className="text-green-700 dark:text-green-400 text-sm mt-1">Енді мәзірде 100% органикалық көкөністер</p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">15 қыркүйек 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          <Card className="dark:bg-[#1e293b] dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span>Кері байланыс формасы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ата-ананың аты-жөні
                    </label>
                    <Input 
                      placeholder="Мысалы: Иванов Иван Иванович"
                      data-testid="input-parent-name"
                      className="dark:bg-[#0f172a] dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Телефон номері
                    </label>
                    <Input 
                      placeholder="+7‒775‒790‒63‒63"
                      data-testid="input-phone"
                      className="dark:bg-[#0f172a] dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Баланың аты-жөні және сыныбы
                  </label>
                  <Input 
                    placeholder="Мысалы: Иванов Алан, 3А сынып"
                    data-testid="input-child-info"
                    className="dark:bg-[#0f172a] dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ұсыныс немесе пікір
                  </label>
                  <Textarea 
                    placeholder="Асхана жұмысы туралы пікіріңізді жазыңыз..."
                    rows={4}
                    data-testid="textarea-feedback"
                    className="dark:bg-[#0f172a] dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                  data-testid="button-submit-feedback"
                >
                  Пікір жіберу
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CanteenPage;
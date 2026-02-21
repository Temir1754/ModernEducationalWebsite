import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function KruzhkiPage() {
  const clubsData = [
    {
      category: "Шығармашылық бағыт",
      color: "from-pink-500 to-purple-600",
      clubs: [
        {
          name: "Хореография",
          description: "Классикалық және заманауи билерді үйрену, пластика және ритм дамыту",
          image: "https://images.unsplash.com/photo-1545224144-b38cd309ef69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 15:00-16:30",
          age: "5-15 жас",
          teacher: "Өмірзақ Мөлдір Абдуллақызы"
        },
        {
          name: "Домбыра",
          description: "Қазақтың ұлттық аспабын үйрену, фольклорлық әндерді орындау",
          image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Сейсенбі, Бейсенбі: 16:00-17:00",
          age: "6-16 жас",
          teacher: "Ержанова Жадыра Нурдуллаевна"
        },
        {
          name: "Дизайн",
          description: "Графикалық дизайн, сурет салу және шығармашылық жобалар",
          image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Дүйсенбі, Сәрсенбі: 14:30-16:00",
          age: "8-16 жас",
          teacher: "Аманбек Жансая Тимурханқызы"
        },
        {
          name: "Глинолепка",
          description: "Балшықпен жұмыс істеу, керамика және мүсін жасау",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Сейсенбі, Жұма: 15:30-17:00",
          age: "5-14 жас",
          teacher: "Кендебайұлы Шынболат"
        }
      ]
    },
    {
      category: "Интеллектуалды бағыт",
      color: "from-blue-500 to-indigo-600",
      clubs: [
        {
          name: "Робототехника",
          description: "Lego роботтарын құрастыру, программалау және басқару",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 16:00-17:30",
          age: "7-15 жас",
          teacher: "Ускенбаева Сая Жоланбаевна"
        },
        {
          name: "Шахмат",
          description: "Шахмат ойынының негіздері, тактика және стратегия үйрену",
          image: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Сейсенбі, Бейсенбі: 15:00-16:30",
          age: "6-16 жас",
          teacher: "Байшоинова Сания Тузельбаевна"
        },
        {
          name: "Speaking Club",
          description: "Ағылшын тілінде сөйлеу дағдыларын дамыту және коммуникация",
          image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Дүйсенбі, Сәрсенбі: 17:00-18:00",
          age: "8-16 жас",
          teacher: "Нұрланқызы Жанеля"
        },
        {
          name: "Дебат",
          description: "Пікірталас дағдылары, сын тұрғысынан ойлау және дәлелдеу",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Сейсенбі, Жұма: 16:30-18:00",
          age: "10-16 жас",
          teacher: "Аширбекова Гулмира Султановна"
        }
      ]
    },
    {
      category: "Спорттық бағыт",
      color: "from-green-500 to-emerald-600",
      clubs: [
        {
          name: "Тэквондо",
          description: "Корей жекпе-жегі, өзін-өзі қорғау және физикалық дайындық",
          image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Дүйсенбі, Сәрсенбі, Жұма: 17:30-19:00",
          age: "6-16 жас",
          teacher: "Камытбаев Айдын Сыпабекович"
        },
        {
          name: "Футбол",
          description: "Командалық ойын, техника және тактика дамыту",
          image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          schedule: "Сейсенбі, Бейсенбі, Сенбі: 16:00-17:30",
          age: "7-16 жас",
          teacher: "Юзыкаев Жасулан Серикбайулы"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* Header with Back Button - Same style as administration */}
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
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Үйірмелер мен секциялар</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
        <div className="text-center mb-6">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Балаларыңыздың қызығушылықтары мен талантын дамытатын көптеген бағыттар
          </p>
        </div>
      </div>

      {/* Clubs by Category */}
      {clubsData.map((category, categoryIndex) => (
        <section key={categoryIndex} className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent mb-4`}>
                {category.category}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {category.clubs.map((club, clubIndex) => (
                <Card key={clubIndex} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-[#1e293b] border dark:border-gray-700">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-20`}></div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{club.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{club.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Кесте:</span> {club.schedule}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Жас шегі:</span> {club.age}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">Мұғалім:</span> {club.teacher}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Contact for Registration */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              Үйірмелерге жазылу
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Балаңызды қызықтыратын үйірмелерге жазылу үшін біздің мектеп әкімшілігімен байланысыңыз. 
              Біз сізге барлық қажетті ақпаратты берер етпіз.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+77757906363"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-full hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Хабарласу
              </a>
              
              <a
                href="https://wa.me/77757906363"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-lg rounded-full hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Users, Mail, Phone } from "lucide-react";

export default function AdministrationPage() {
  const administrators = [
    {
      name: "Бейсбаева Жұлдыз Мейіржанқызы",
      position: "Мектеп директоры",
      education: "Назарбаев Университет",
      experience: "2 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    },
    {
      name: "Сарсенбаева Алия Раманкуловна",
      position: "Оқу ісі жөніндегі директордың орынбасары",
      education: "Халықаралық Қазақ Түрік университеті",
      experience: "32 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    },
    {
      name: "Утепбаева Махаббат Анарбековна",
      position: "Тәрбие ісі жөніндегі директордың орынбасары",
      education: "Халықаралық Қазақ Түрік университеті",
      experience: "37 жыл педагогикалық тәжірибе",
      email: "fgs.school.2022@gmail.com",
      phone: "+7-775-790-63-63"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
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
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Әкімшілік құрамы</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12 pb-6 sm:pt-16 sm:pb-8">
        <div className="text-center mb-6">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            FGS мектебінің әкімшілік құрамы - тәжірибелі және білікті мамандар, 
            олар мектептің сапалы жұмысын қамтамасыз етеді.
          </p>
        </div>

        <div className="grid gap-8">
          {administrators.map((admin, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 dark:bg-[#1e293b] dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center">
                      <Users className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      Фото жақын арада қосылады
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{admin.name}</h3>
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">{admin.position}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Білімі:</h4>
                        <p className="text-gray-600 dark:text-gray-300">{admin.education}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Тәжірибе:</h4>
                        <p className="text-gray-600 dark:text-gray-300">{admin.experience}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a 
                          href={`mailto:${admin.email}`}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {admin.email}
                        </a>
                        <a 
                          href={`tel:${admin.phone.replace(/[-\s]/g, '')}`}
                          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          {admin.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-300">Әкімшілікпен байланысу</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-blue-700 dark:text-blue-300">
              <p className="mb-2">
                <strong>Жұмыс уақыты:</strong> Дүйсенбі - жұма, 08:00 - 18:00
              </p>
              <p className="mb-2">
                <strong>Қабылдау уақыты:</strong> Сәрсенбі, 14:00 - 16:00 (алдын-ала келісу бойынша)
              </p>
              <p>
                <strong>Мекенжай:</strong> Шымкент қаласы, Өтегенова көшесі 43А
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

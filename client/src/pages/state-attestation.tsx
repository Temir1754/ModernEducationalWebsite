import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Award, FileText, Download, Calendar, CheckCircle } from "lucide-react";
import SEOHead from "@/components/seo-head";

export default function StateAttestationPage() {
  const attestationDocuments = [
    {
      title: "Мемлекеттік аттестаттау туралы ережелер",
      description: "ҚР БжҒМ бекіткен негізгі ережелер",
      date: "2024 жылы жаңартылған",
      url: "#"
    },
    {
      title: "Мектептің өзін-өзі бағалау нәтижелері",
      description: "2023-2024 оқу жылы бойынша толық есеп",
      date: "2024 жылы дайындалған",
      url: "#"
    },
    {
      title: "Сыртқы бағалау нәтижелері",
      description: "Сарапшылар комиссиясының қорытындысы",
      date: "2024 жылы",
      url: "#"
    }
  ];

  const criteria = [
    {
      title: "Білім беру бағдарламаларының сапасы",
      status: "Сәйкес келеді",
      description: "Мектептің барлық білім беру бағдарламалары мемлекеттік стандарттарға сәйкес келеді"
    },
    {
      title: "Педагогикалық кадрлардың біліктілігі",
      status: "Жоғары деңгей",
      description: "Мұғалімдердің 95%-ы жоғары санатқа ие және үздіксіз білім алуда"
    },
    {
      title: "Материалдық-техникалық база",
      status: "Заманауи деңгей",
      description: "Мектеп заманауи жабдықтармен және технологиялармен жабдықталған"
    },
    {
      title: "Оқушылардың оқу жетістіктері",
      status: "Жоғары көрсеткіш",
      description: "Үлгерім 95% құрайды, НИШ/РФМШ түсу көрсеткіші жоғары"
    }
  ];

  return (
    <>
      <SEOHead page="stateAttestation" />
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button - Enhanced for mobile */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Басты бетке оралу</span>
                <span className="sm:hidden">Басты бет</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Award className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Мемлекеттік аттестаттау</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">

          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-blue-800">Аттестаттау туралы жалпы ақпарат</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  FGS мектебі мемлекеттік аттестаттаудан табысты өтті және білім беру қызметін жүргізуге
                  лицензиясы бар. Аттестаттау барысында мектептің барлық қызметі мұқият тексеріліп,
                  жоғары бағалау алды.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Соңғы аттестаттау</h4>
                    <p className="text-blue-700 text-sm">2024 жылғы наурыз айы</p>
                    <p className="text-blue-600 text-sm">Нәтиже: "Сәйкес келеді"</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Келесі аттестаттау</h4>
                    <p className="text-green-700 text-sm">2029 жылы болжануда</p>
                    <p className="text-green-600 text-sm">Кезеңділік: 5 жыл сайын</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Criteria */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Бағалау критерийлері және нәтижелер</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteria.map((criterion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{criterion.title}</h4>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {criterion.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{criterion.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <span>Аттестаттау құжаттары</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attestationDocuments.map((doc, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{doc.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                      <p className="text-gray-500 text-xs">{doc.date}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        alert('Құжат жүктелуде... (PDF файлы әзірлеу кезеңінде)');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Жүктеу
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Assessment */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Мектептің өзін-өзі бағалау</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-blue-700">
                <p className="mb-4">
                  Мектеп үздіксіз өзін-өзі бағалау жүйесін жүргізеді. Жыл сайын мынадай көрсеткіштер бойынша
                  талдау жасалады:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Оқушылардың академиялық жетістіктері</li>
                  <li>• Мұғалімдердің кәсіби дамуы</li>
                  <li>• Ата-аналардың қанағаттану деңгейі</li>
                  <li>• Материалдық-техникалық базаның жағдайы</li>
                  <li>• Тәрбие жұмысының тиімділігі</li>
                </ul>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
}
import { useState } from "react";
import { ChevronDown, Trophy, Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OlympiadResult {
  subject: string;
  year: string;
  achievement: string;
  students: string[];
  level: string;
}

const olympiadResults: OlympiadResult[] = [
  {
    subject: "Математика",
    year: "2024",
    achievement: "1-орын",
    students: ["Айдана Қасымова", "Дәурен Нұрланов"],
    level: "Облыстық олимпиада"
  },
  {
    subject: "Физика",
    year: "2024",
    achievement: "2-орын",
    students: ["Арман Жақсылыков"],
    level: "Қалалық олимпиада"
  },
  {
    subject: "Химия",
    year: "2023",
    achievement: "3-орын",
    students: ["Сәуле Темірбекова"],
    level: "Облыстық олимпиада"
  },
  {
    subject: "Биология",
    year: "2024",
    achievement: "1-орын",
    students: ["Нұржан Әлібеков", "Дина Сағындықова"],
    level: "Қалалық олимпиада"
  },
  {
    subject: "Информатика",
    year: "2024",
    achievement: "2-орын",
    students: ["Асхат Бақытжанов"],
    level: "Республикалық олимпиада"
  }
];

export default function MobileOlympiadAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getIcon = (subject: string) => {
    switch (subject) {
      case "Математика": return <Trophy className="w-5 h-5 text-yellow-600" />;
      case "Физика": return <Award className="w-5 h-5 text-blue-600" />;
      case "Химия": return <Star className="w-5 h-5 text-green-600" />;
      case "Биология": return <Award className="w-5 h-5 text-emerald-600" />;
      case "Информатика": return <Trophy className="w-5 h-5 text-purple-600" />;
      default: return <Award className="w-5 h-5 text-blue-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Республикалық олимпиада": return "bg-red-100 text-red-800";
      case "Облыстық олимпиада": return "bg-blue-100 text-blue-800";
      case "Қалалық олимпиада": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3">
      {olympiadResults.map((result, index) => (
        <Card key={index} className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-0">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon(result.subject)}
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {result.subject} - {result.achievement}
                    </h3>
                    <p className="text-xs text-gray-600">{result.year} жыл</p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3 space-y-3">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(result.level)}`}>
                    {result.level}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Жеңімпаз оқушылар:</h4>
                    <ul className="space-y-1">
                      {result.students.map((student, studentIndex) => (
                        <li key={studentIndex} className="text-sm text-gray-600 flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                          {student}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
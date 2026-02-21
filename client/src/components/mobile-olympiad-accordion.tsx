import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MobileOlympiadAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const students = [
    {
      id: 0,
      name: "5 сынып, Белов Вячеслав",
      achievements: [
        '1 орын - "Дарын" олимпиада (аудандық)',
        '2 орын - "Алтын сақа" (аудандық)',
        '3 орын - "Алтын сақа" (облыстық)'
      ],
      scores: []
    },
    {
      id: 1,
      name: "6 сынып, Ермаханұлы Мардан",
      achievements: [
        '1 орын - "Алтын сақа" (аудандық)',
        '1 орын - "Алтын сақа" (облыстық)',
        '3 орын - "Алтын сақа" (республикалық)'
      ],
      scores: ["НИШ - 1251 балл"]
    },
    {
      id: 2,
      name: "6 сынып, Жаксыбек Ерхан",
      achievements: [
        '1 орын - "Алтын сақа" (аудандық)',
        '1 орын - "Дарын" (аудандық)',
        '1 орын - "Алтын сақа" (облыстық)'
      ],
      scores: ["НИШ - 1324 балл", "РФМШ - 115 балл", "БИЛ - 213 балл"]
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getBorderColor = (index: number) => {
    const colors = ["border-yellow-500", "border-green-500", "border-blue-500"];
    return colors[index] || "border-gray-500";
  };

  const getScoreBackgrounds = (scoreIndex: number) => {
    const backgrounds = ["bg-green-50 text-green-700", "bg-purple-50 text-purple-700", "bg-yellow-50 text-yellow-700"];
    return backgrounds[scoreIndex] || "bg-blue-50 text-blue-700";
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        НИШ және РФМШ дайындық бағдарламалары
      </h3>
      
      {students.map((student) => (
        <div key={student.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor(student.id)} overflow-hidden`}>
          <button
            onClick={() => toggleAccordion(student.id)}
            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <h4 className="text-lg font-semibold text-gray-800">{student.name}</h4>
            {openIndex === student.id ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {openIndex === student.id && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="space-y-2 mt-3">
                {student.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-center">
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
              
              {student.scores.length > 0 && (
                <div className="mt-3 space-y-1">
                  {student.scores.map((score, scoreIndex) => (
                    <div key={scoreIndex} className={`p-2 rounded ${getScoreBackgrounds(scoreIndex)}`}>
                      <span className="font-medium">{score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileOlympiadAccordion;
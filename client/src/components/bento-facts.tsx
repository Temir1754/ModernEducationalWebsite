import { motion } from "framer-motion";
import nisSuccess from "@/assets/nis-success.webp";
import schoolLife from "@/assets/untitled-2030_1760364226199.webp";

const bentoItems = [
  {
    title: "Біздің мектептегі өмір",
    description: "Білімді ұрпақ жекеменшік мектебінде балалардың жан-жақты дамуы үшін барлық жағдай жасалған. Біздің заманауи кампусымыз тек білім алу орны ғана емес, сонымен қатар оқушылардың шығармашылық, интеллектуалдық және физикалық әлеуетін ашатын нағыз шабыт мекені. Жайлы сыныптар, инновациялық зертханалар, спорт залдары мен демалыс аймақтары әрбір баланың өзін еркін әрі сенімді сезінуіне ықпал етеді. Мұнда оқушылар тек академиялық білім алып қана қоймай, өмірлік маңызды дағдыларды меңгеріп, болашаққа нық қадам басады.",
    className: "md:col-span-2 md:row-span-2 bg-blue-900/20 border border-blue-500/20",
    image: schoolLife,
    badge: "Кампус"
  },
  {
    title: "Интеллектуалды басқару",
    description: "Мектеп басшылығы мен оқытушылар құрамы — еліміздің жетекші оқу орындары, соның ішінде РФМШ және Назарбаев Университетінің тәжірибелі түлектері. Біздің ұжым озық білім беру әдістемелерін қолдана отырып, әр оқушының жеке қабілеттерін дамытуға бағытталған жоғары сапалы академиялық ортаны қалыптастырады.",
    className: "md:col-span-1 md:row-span-1 bg-indigo-900/20 border border-indigo-500/20",
    badge: "Команда"
  },
  {
    title: "2022 жылдан бері",
    description: "2022 жылы құрылған мектебіміз қысқа уақыт ішінде Шымкент қаласындағы ең озық және қарқынды дамып келе жатқан білім ордаларының біріне айналды. Біз заманауи технологиялар мен дәстүрлі құндылықтарды ұштастыра отырып, жаңа буын көшбасшыларын тәрбиелеу жолында тынбай еңбек етіп келеміз.",
    className: "md:col-span-1 md:row-span-1 bg-slate-800/50 border border-slate-600/30",
    badge: "Тарих"
  },
  {
    title: "Мотивация жүйесі",
    description: "Оқушылардың оқуға деген ынтасын арттыру мақсатында бірегей UPay мотивациялық жүйесін енгіздік. Бұл біздің ішкі электронды валютамыз. Оқушылар жақсы бағалар, белсенділік және жетістіктері үшін UPay жинап, оларды арнайы аукциондарда құнды сыйлықвар мен оқу құралдарына алмастыра алады. Бұл жүйе қаржылық сауаттылықты да қалыптастырады.",
    className: "md:col-span-2 md:row-span-1 bg-purple-900/20 border border-purple-500/20",
    badge: "UPay"
  },
  {
    title: "Үздік мектептерге жол",
    description: "Біздің арнайы әзірленген дайындық бағдарламамыз оқушыларға еліміздің ең беделді мектептеріне (НИШ, РФМШ және БИЛ) түсуге толық мүмкіндік береді. Тәжірибелі ұстаздардың жетекшілігімен логика, математика және сыни ойлау дағдыларын тереңдетіп оқытамыз. Нәтижесінде біздің түлектер ең күрделі емтихандардан сәтті өтіп, жоғары көрсеткіштерге қол жеткізуде.",
    className: "md:col-span-2 md:row-span-1 bg-amber-900/20 border border-amber-500/20",
    image: nisSuccess,
    badge: "Дайындық"
  },
  {
    title: "Толық күн форматы",
    description: "Біздің мектеп таңғы 08:00-ден кешкі 18:00-ге дейін жұмыс істейді. Бұл формат ата-аналарға ыңғайлылық сыйлап, балалардың уақытын тиімді пайдалануға көмектеседі. Оқушылар барлық үй тапсырмаларын мұғалімдердің қадағалауымен мектепте орындайды, сондай-ақ қосымша үйірмелер мен спорттық секцияларға қатысып, жан-жақты дамиды.",
    className: "md:col-span-2 md:row-span-1 bg-green-900/20 border border-green-500/20 flex-row items-center",
    badge: "08:00 - 18:00"
  },
];

export default function BentoFacts() {
  return (
    <section className="py-10 bg-[#0f172a]" id="facts">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary dark:text-white font-extrabold tracking-[0.2em] uppercase text-lg md:text-xl block mb-2"
          >
            Неліктен бізді таңдайды?
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mt-4 text-white leading-tight"
          >
            Білімді ұрпақ жекеменшік мектебі — бұл <span className="text-primary">сапа мен нәтиже</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 min-h-[800px]">
          {bentoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-3xl p-8 relative overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-transparent hover:border-primary/10 ${item.className}`}
            >
              <div className="relative z-10 h-full flex flex-col justify-center">
                <div>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {item.image && (
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
              )}
              
              {/* Decorative background circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-primary/5 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

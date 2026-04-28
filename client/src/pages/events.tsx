import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import SEOHead from "@/components/seo-head";
import { format } from "date-fns";
import { kk } from "date-fns/locale";

interface SchoolEvent {
  id: string;
  month: string;
  title: string;
  dateText: string;
  description: string;
  mediaUrl?: string;
  mediaType?: string;
}

const EventsPage = () => {
  const { data: events = [], isLoading } = useQuery<SchoolEvent[]>({
    queryKey: ["/api/events"],
  });

  // Group events by month
  const months = Array.from(new Set(events.map(e => e.month)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <SEOHead page="home" customTitle="Іс-шаралар күнтізбесі | FGS School" />

      

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1e293b] rounded-xl shadow-sm">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Жақын арада іс-шаралар жоспарланбаған</p>
          </div>
        ) : (
          <div className="space-y-12">
            {months.map(month => (
              <section key={month}>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-6 border-l-4 border-blue-600 pl-4">
                  {month}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events
                    .filter(e => e.month === month)
                    .map(event => (
                      <Card key={event.id} className="dark:bg-[#1e293b] dark:border-gray-700 hover:shadow-md transition-shadow duration-200 border-t-4 border-t-blue-500">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold dark:text-gray-100">{event.title}</CardTitle>
                          </div>
                          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-2 font-semibold">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {event.dateText}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {event.description}
                          </p>
                          {event.mediaUrl && (
                            <div className="mt-4 rounded-lg overflow-hidden border dark:border-gray-700">
                              <img 
                                src={event.mediaUrl} 
                                alt={event.title}
                                className="w-full h-40 object-cover"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Planning Info */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-10 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Іс-шараны өткізуді жоспарлайсыз ба?</h3>
            <p className="text-blue-100 mb-6 max-w-xl">
              Мектеп іс-шараларына қатысуға немесе өз ұсынысыңызды білдіруге әрдайым мүмкіндігіңіз бар. 
              Мектеп әкімшілігімен хабарласып, толық ақпарат алыңыз.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-blue-700 hover:bg-blue-50">Хабарласу</Button>
            </div>
          </div>
          <CalendarIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12" />
        </Card>
      </div>
    </div>
  );
};

export default EventsPage;

function Button({ children, className, ...props }: any) {
  return (
    <button 
      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}

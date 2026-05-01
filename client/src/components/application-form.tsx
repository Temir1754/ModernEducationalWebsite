import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const applicationSchema = z.object({
  studentName: z.string().min(2, "Баланың аты-жөні міндетті"),
  birthDate: z.string().min(1, "Туған күні міндетті"),
  grade: z.string().min(1, "Сыныпты таңдаңыз"),
  language: z.string().min(1, "Оқу тілін таңдаңыз"),
  parentName: z.string().min(2, "Ата-ананың аты-жөні міндетті"),
  phone: z.string().min(10, "Телефон номері міндетті"),
  address: z.string().optional(),
  additionalInfo: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, "Келісімге қол қою міндетті"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentName: "",
      birthDate: "",
      grade: "",
      language: "",
      parentName: "",
      phone: "",
      address: "",
      additionalInfo: "",
      consent: false,
    },
  });

  const capitalizeFirst = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    // Create WhatsApp message
    const message = `Сәлеметсіз бе! Білімді ұрпақ жекеменшік мектебіне өтінім:

👤 Баланың аты-жөні: ${data.studentName}
📅 Туған күні: ${data.birthDate}
🎓 Сынып: ${data.grade}
🗣️ Оқу тілі: ${data.language === 'kz' ? 'Қазақ тілі' : 'Орыс тілі'}
👨‍👩‍👧‍👦 Ата-ананың аты-жөні: ${data.parentName}
📞 Телефон: ${data.phone}
${data.address ? `🏠 Мекенжай: ${data.address}` : ''}
${data.additionalInfo ? `💬 Қосымша ақпарат: ${data.additionalInfo}` : ''}`;

    const whatsappUrl = `https://wa.me/77757906363?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
      form.reset();
      alert('Өтінім WhatsApp арқылы жіберілді!');
    }, 1000);
  };

  return (
    <div className="w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">Мектепке өтінім жіберу</h2>
            <p className="text-xl text-gray-300">
              Балаңызды Білімді ұрпақ жекеменшік мектебіне орналастыру үшін өтінім толтырыңыз
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/10 text-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Баланың аты-жөні *</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-400" 
                          placeholder="Толық аты-жөніні енгізіңіз" 
                          autoComplete="name"
                          {...field} 
                          onChange={(e) => field.onChange(capitalizeFirst(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Туған күні *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-slate-900 border-slate-700 text-white hover:bg-slate-800 hover:text-white transition-all duration-200",
                                !field.value && "text-gray-400"
                              )}
                            >
                              {field.value ? (
                                field.value
                              ) : (
                                <span>КК.АА.ЖЖЖЖ</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700 shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value.split('.').reverse().join('-')) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(format(date, "dd.MM.yyyy"));
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            className="bg-slate-900 text-white rounded-md border border-slate-700"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сынып *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Сыныпты таңдаңыз" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="0" className="focus:bg-slate-700 focus:text-white">0 сынып</SelectItem>
                          <SelectItem value="1" className="focus:bg-slate-700 focus:text-white">1 сынып</SelectItem>
                          <SelectItem value="2" className="focus:bg-slate-700 focus:text-white">2 сынып</SelectItem>
                          <SelectItem value="3" className="focus:bg-slate-700 focus:text-white">3 сынып</SelectItem>
                          <SelectItem value="4" className="focus:bg-slate-700 focus:text-white">4 сынып</SelectItem>
                          <SelectItem value="5" className="focus:bg-slate-700 focus:text-white">5 сынып</SelectItem>
                          <SelectItem value="6" className="focus:bg-slate-700 focus:text-white">6 сынып</SelectItem>
                          <SelectItem value="7" className="focus:bg-slate-700 focus:text-white">7 сынып</SelectItem>
                          <SelectItem value="8" className="focus:bg-slate-700 focus:text-white">8 сынып</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Оқу тілі *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Тілді таңдаңыз" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="kz" className="focus:bg-slate-700 focus:text-white">Қазақ тілі</SelectItem>
                          <SelectItem value="ru" className="focus:bg-slate-700 focus:text-white">Орыс тілі</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ата-ананың аты-жөні *</FormLabel>
                      <FormControl>
                        <Input 
                          className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-400" 
                          placeholder="Ата-ананың толық аты-жөні" 
                          autoComplete="name"
                          {...field} 
                          onChange={(e) => field.onChange(capitalizeFirst(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон номері *</FormLabel>
                        <FormControl>
                          <Input 
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-400" 
                            placeholder="+7 (___) ___-__-__" 
                            autoComplete="tel"
                            {...field} 
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              
                              // If they type 11 digits starting with 7 or 8, it's a full number with prefix (e.g. 8707...)
                              // We remove the first digit to keep only the 10-digit mobile number.
                              if (value.length === 11 && (value.startsWith("7") || value.startsWith("8"))) {
                                value = value.substring(1);
                              } else if (value.length > 11) {
                                // If it's even longer, just take the last 10 digits
                                value = value.slice(-10);
                              }
                              
                              // Limit to exactly 10 digits of the actual number
                              value = value.substring(0, 10);
                              
                              let formatted = "";
                              if (value.length > 0) {
                                formatted = "+7 (" + value.substring(0, 3);
                                if (value.length >= 3) {
                                  formatted += ") ";
                                  if (value.length > 3) {
                                    formatted += value.substring(3, 6);
                                    if (value.length >= 6) {
                                      formatted += "-";
                                      if (value.length > 6) {
                                        formatted += value.substring(6, 8);
                                        if (value.length >= 8) {
                                          formatted += "-";
                                          if (value.length > 8) {
                                            formatted += value.substring(8, 10);
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                              field.onChange(formatted);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Мекенжай</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-400"
                            rows={3}
                            placeholder="Толық мекенжайды жазыңыз"
                            autoComplete="street-address"
                            {...field} 
                            onChange={(e) => field.onChange(capitalizeFirst(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Қосымша ақпарат</FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-gray-400"
                            rows={3}
                            placeholder="Баланың ерекшеліктері, қызығушылықтары туралы жазыңыз"
                            {...field}
                            onChange={(e) => field.onChange(capitalizeFirst(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm text-gray-300">
                            Жеке деректерді өңдеуге келісемін және мектептің ережелерімен таныстым *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-1 transform hover:scale-105 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    {isSubmitting ? "Жіберілуде..." : "Өтінім жіберу"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      const whatsappUrl = "https://wa.me/77757906363?text=Сәлеметсіз%20бе!%20Білімді%20ұрпақ%20мектебіне%20баламды%20қабылдау%20туралы%20ақпарат%20алғым%20келеді.";
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <i className="fab fa-whatsapp mr-2"></i>
                    WhatsApp арқылы хабарласу
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
    </div>
  );
}

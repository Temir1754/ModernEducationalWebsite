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

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    
    // Create WhatsApp message
    const message = `Сәлеметсіз бе! FGS мектебіне өтінім:

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
    <section id="apply" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Мектепке өтінім жіберу</h2>
            <p className="text-xl text-gray-600">
              Балаңызды FGS мектебіне орналастыру үшін өтінім толтырыңыз
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Баланың аты-жөні *</FormLabel>
                      <FormControl>
                        <Input placeholder="Толық аты-жөніні енгізіңіз" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Туған күні *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
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
                        <SelectContent>
                          <SelectItem value="0">0 сынып</SelectItem>
                          <SelectItem value="1">1 сынып</SelectItem>
                          <SelectItem value="2">2 сынып</SelectItem>
                          <SelectItem value="3">3 сынып</SelectItem>
                          <SelectItem value="4">4 сынып</SelectItem>
                          <SelectItem value="5">5 сынып</SelectItem>
                          <SelectItem value="6">6 сынып</SelectItem>
                          <SelectItem value="7">7 сынып</SelectItem>
                          <SelectItem value="8">8 сынып</SelectItem>
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
                        <SelectContent>
                          <SelectItem value="kz">Қазақ тілі</SelectItem>
                          <SelectItem value="ru">Орыс тілі</SelectItem>
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
                        <Input placeholder="Ата-ананың толық аты-жөні" {...field} />
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
                        <Input placeholder="+7 (___) ___-__-__" {...field} />
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
                            rows={3}
                            placeholder="Толық мекенжайды жазыңыз"
                            {...field}
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
                            rows={3}
                            placeholder="Баланың ерекшеліктері, қызығушылықтары туралы жазыңыз"
                            {...field}
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
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
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
                      const whatsappUrl = "https://wa.me/77757906363?text=Сәлеметсіз%20бе!%20FGS%20мектебіне%20баламды%20қабылдау%20туралы%20ақпарат%20алғым%20келеді.";
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
    </section>
  );
}

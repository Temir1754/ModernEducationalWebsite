import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Review, InsertReview } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

export default function ReviewsSection() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const mutation = useMutation({
    mutationFn: async (newReview: InsertReview) => {
      await apiRequest("POST", "/api/reviews", newReview);
    },
    onSuccess: () => {
      toast({
        title: "Рахмет!",
        description: "Сіздің пікіріңіз модерациядан кейін пайда болады.",
      });
      setIsModalOpen(false);
      setRating(5);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertReview = {
      authorName: formData.get("authorName") as string,
      content: formData.get("content") as string,
      rating: rating,
      source: "site",
    };
    mutation.mutate(data);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "2gis":
        return <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">2GIS</span>;
      case "yandex":
        return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">Yandex</span>;
      default:
        return <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Сайт</span>;
    }
  };

  if (isLoading) return null;

  return (
    <section className="py-10 bg-[#0f172a] overflow-hidden" id="reviews">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Біз туралы <span className="text-primary">пікірлер</span>
            </motion.h2>
            <p className="text-gray-300 text-lg">
              Ата-аналар мен оқушылардың біз туралы ойлары. Біз әр пікірді бағалаймыз.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent">
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl transition-all scale-100 hover:scale-105 active:scale-95">
                  Пікір қалдыру
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0f172a] border-none shadow-2xl z-[9999] !opacity-100">
                <DialogHeader>
                  <DialogTitle className="text-gray-900 dark:text-white text-2xl font-bold">Жаңа пікір қалдыру</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Аты-жөніңіз</label>
                    <Input 
                      name="authorName" 
                      placeholder="Атыңызды жазыңыз" 
                      className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:text-white" 
                      required 
                      onInput={(e) => {
                        const val = e.currentTarget.value;
                        if (val) e.currentTarget.value = val.charAt(0).toUpperCase() + val.slice(1);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Бағалау</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-8 w-8 cursor-pointer transition-all hover:scale-110 ${
                            s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                          onClick={() => setRating(s)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Пікіріңіз</label>
                    <Textarea 
                      name="content" 
                      placeholder="Біз туралы ойыңызды бөлісіңіз..." 
                      className="min-h-[120px] bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:text-white"
                      required 
                      onInput={(e) => {
                        const val = e.currentTarget.value;
                        if (val) e.currentTarget.value = val.charAt(0).toUpperCase() + val.slice(1);
                      }}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Жіберілуде..." : "Жіберу"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={review.id} className="embla__slide flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="h-full border-none shadow-xl shadow-black/20 bg-slate-800/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex flex-col">
                            <h3 className="font-bold text-white text-lg leading-tight mb-1">
                              {review.authorName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              {getSourceIcon(review.source)}
                            </div>
                          </div>
                          <Quote className="h-10 w-10 text-primary/10 rotate-180" />
                        </div>
                        <p className="text-gray-300 italic leading-relaxed relative z-10">
                          "{review.content}"
                        </p>
                        <div className="mt-6 text-sm text-gray-400">
                          {new Date(review.createdAt!).toLocaleDateString('ru-RU')}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Әзірге пікірлер жоқ. Алғашқы болып қалдырыңыз!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

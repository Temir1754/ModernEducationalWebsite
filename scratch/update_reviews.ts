
import { db } from "../server/db";
import { reviews } from "../shared/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

async function updateReviews() {
  console.log("Deleting old reviews...");
  await db.delete(reviews);

  const newReviews = [
    {
      id: crypto.randomUUID(),
      authorName: "Aigul Seidullaeva",
      rating: 5,
      content: "Жаксы мектеп, балаларға жан жақты пайдалы ілім білім беруге тырысады! Мектеп ұжымына улкен рақмет!",
      source: "2gis",
      isApproved: true,
      createdAt: new Date("2025-06-03")
    },
    {
      id: crypto.randomUUID(),
      authorName: "Асель Тлепова",
      rating: 5,
      content: "Көп рахмет «Білімді ұрпақ» мектеп ұжымына, ұстаздарға. Өте білікті мамандар. Мектепте неше түрлі баланы жан-жақты дамытатын ойындар, үйірмелер, олимпиадалар, конкурстар, жәрмеңке, дебат, тағы да басқа іс-шаралар жиі өтіп тұрады. Ұлымыз НИШ қа осы мектепте тест тапсырып, жоғары нәтиже көрсеттті.",
      source: "2gis",
      isApproved: true,
      createdAt: new Date("2025-06-03")
    },
    {
      id: crypto.randomUUID(),
      authorName: "Бибайша Султанкулова",
      rating: 5,
      content: "Қаладағы ең жақсы жеке меншік мектеп! Тамағына балам риза, дәмді деп айтып келеді. Назарбаев мектебіне жақсы дайындады, сол жерде сабақ оқып сол жерде дайындық, тамағын ішіп. Бала бір жерде отырып дайындалғаны дұрыс, курстан курсқа көшеде жүрмей. Мектеп ұжымына мың алғыс. Уали Ерасыл апасымын.",
      source: "2gis",
      isApproved: true,
      createdAt: new Date("2025-06-02")
    },
    {
      id: crypto.randomUUID(),
      authorName: "Гулнур Абильдаева",
      rating: 5,
      content: "Мектеп ұжымына үлкен алғыс айтамын, бірлігі жарасқан орта, креативті атмасфера, бізге ұнайды. «Білімді ұрпақ» мектебіне үлкен жетістіктер тілеймін, тарихта қаларлықтай үлкен дамыған сапалы мектеп болыңыздар!",
      source: "2gis",
      isApproved: true,
      createdAt: new Date("2025-06-02")
    },
    {
      id: crypto.randomUUID(),
      authorName: "Айару Бақытқызы",
      rating: 4,
      content: "Можно хорошо получать знания а также найти хороших друзей. Образование нормальное, но с дисциплиной строго. Хочу отметить что учителя по казахскому строгие, будет не лишним обратить на это внимание. Но там есть и добрые учителя, что очень хорошо.",
      source: "2gis",
      isApproved: true,
      createdAt: new Date("2025-05-25")
    }
  ];

  console.log("Inserting new reviews...");
  for (const review of newReviews) {
    await db.insert(reviews).values(review);
  }

  console.log("Done!");
}

updateReviews().catch(console.error);

import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Спасибо за заявку',
  description: 'Заявка успешно отправлена. Мы свяжемся с Вами в ближайшее время.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center pt-[3.75rem] lg:pt-[5rem] px-4 py-16">
        <div className="text-center max-w-[37.5rem] mx-auto">
          <h1 className="text-[#202124] font-montserrat font-bold text-[1.75rem] sm:text-[2.25rem] leading-[1.3] mb-[1.25rem]">
            Спасибо за заявку!
          </h1>
          <p className="text-[#202124] font-montserrat font-normal text-[1rem] sm:text-[1.125rem] leading-[1.6] mb-[2.5rem]">
            Мы получили Вашу заявку и свяжемся с Вами в ближайшее время.
          </p>
          <Button asChild className="bg-[#3264F6] hover:bg-[#2950D4] text-white font-montserrat font-medium h-[2.75rem] px-[1.5rem] rounded-[2.125rem]">
            <Link href="/">Вернуться на главную</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

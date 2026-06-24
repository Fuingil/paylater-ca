import { notFound } from "next/navigation";

import { About } from "@/components/About";
import { Buyers } from "@/components/Buyers";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UseCases } from "@/components/UseCases";
import { WhyDomain } from "@/components/WhyDomain";
import { createCaptchaChallenge } from "@/lib/captcha";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const initialCaptcha = createCaptchaChallenge();

  return (
    <>
      <Header dict={dict} />
      <main>
        <Hero dict={dict} />
        <About dict={dict} />
        <UseCases dict={dict} />
        <Buyers dict={dict} />
        <WhyDomain dict={dict} />
        <ContactForm
          dict={dict}
          locale={locale as Locale}
          initialCaptcha={initialCaptcha}
        />
        <FAQ dict={dict} />
      </main>
      <Footer dict={dict} />
      <LanguageSwitcher locale={locale as Locale} />
    </>
  );
}

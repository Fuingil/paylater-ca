import { About } from "@/components/About";
import { Buyers } from "@/components/Buyers";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { UseCases } from "@/components/UseCases";
import { WhyDomain } from "@/components/WhyDomain";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <UseCases />
        <Buyers />
        <WhyDomain />
        <ContactForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

import { unstable_noStore as noStore } from "next/cache";

import { ContactForm } from "@/components/ContactForm";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { createCaptchaChallenge } from "@/lib/captcha";

export const dynamic = "force-dynamic";

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export function ContactFormSection({ dict, locale }: Props) {
  noStore();
  const initialCaptcha = createCaptchaChallenge();

  return (
    <ContactForm
      dict={dict}
      locale={locale}
      initialCaptcha={initialCaptcha}
    />
  );
}

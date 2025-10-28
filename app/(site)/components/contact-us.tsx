import Link from "next/link";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const WHATSAPP_NUMBER = "+919619412234";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`;

const contactItems = [
  {
    title: "Our Address",
    description: [
      "Apeejay House,",
      "3 Dinshaw Vacha Road,",
      "Churchgate, Mumbai - 400020",
    ],
    icon: MapPin,
  },
  {
    title: "Call Us",
    description: ["+91 96194 12234"],
    icon: Phone,
    href: "tel:+919619412234",
  },
  {
    title: "Email Us",
    description: ["support@reviveeducation.in"],
    icon: Mail,
    href: "mailto:support@reviveeducation.in",
  },
];

export function ContactUsSection() {
  return (
    <section id="contact" className="w-full bg-white py-12 md:py-20">
      <div className="section-container mx-auto max-w-6xl px-4 md:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9dce6] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#3D38B8] md:gap-2 md:px-3 md:py-1 md:text-[11px]">
            <span
              aria-hidden
              className="inline-flex h-1 w-1 rounded-full bg-[#3D38B8] md:h-1.5 md:w-1.5"
            />
            Contact us
          </span>
          <h2 className="mt-2 text-lg font-semibold leading-tight text-[#10131a] md:mt-4 md:text-4xl">
            Let&rsquo;s connect and guide your MBA journey
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5a6072] md:mt-4 md:text-base">
            Reach out anytime for counselling support, application guidance, or
            program questions.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-2 gap-2 md:mt-12 md:grid-cols-3 md:gap-5">
          {contactItems.map((item) => {
            const Icon = item.icon;

            const content = (
              <div className="flex h-full flex-col rounded-2xl border border-[#E4E5F2] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-6">
                <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#F2F1FF] text-[#3D38B8] md:mb-6 md:h-12 md:w-12">
                  <Icon
                    className="h-4 w-4 md:h-7 md:w-7"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </span>
                <h3 className="text-sm font-semibold text-[#10131a] md:text-xl">
                  {item.title}
                </h3>
                <div
                  className={`mt-2 space-y-0.5 font-medium leading-relaxed text-[#5a6072] md:mt-4 md:space-y-1 ${
                    item.title === "Our Address"
                      ? "text-[10px] md:text-sm"
                      : "text-xs md:text-sm"
                  }`}
                >
                  {item.description.map((line) =>
                    item.href ? (
                      <a
                        key={line}
                        href={item.href}
                        className="block text-[#3D38B8] transition hover:text-[#514EA1]"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line}>{line}</p>
                    )
                  )}
                </div>
                {/* WhatsApp button removed per mobile simplification */}
              </div>
            );

            return (
              <div
                key={item.title}
                className={`h-full ${
                  item.title === "Email Us" ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                {content}
              </div>
            );
          })}

          <div className="col-span-2 flex h-full flex-col justify-between rounded-2xl border border-[#E4E5F2] bg-[#F7F6FF] p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 md:col-span-3 md:p-6">
            <div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#F2F1FF] text-[#3D38B8] md:h-12 md:w-12">
                <Send
                  className="h-4 w-4 md:h-6 md:w-6"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-[#10131a] md:mt-6 md:text-xl">
                Admissions Open Join Us
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5a6072] md:mt-4 md:text-sm">
                Share your details and our counsellor will help you shortlist,
                plan fees, and start your application.
              </p>
            </div>
            <div className="mt-4 md:mt-6">
              <Link
                href="/lead-form"
                className="inline-flex items-center justify-center rounded-full bg-[#3D38B8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#514EA1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D38B8] md:px-6 md:text-sm"
              >
                Apply Now
              </Link>
              <p className="mt-2 text-[10px] text-[#9197ad] md:text-xs">
                Email us anytime at{" "}
                <span className="font-medium">support@reviveeducation.in</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUsSection;

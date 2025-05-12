import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us | Blog Application",
  description: "Get in touch with our team for support, inquiries, or feedback",
  openGraph: {
    title: "Contact Us | Blog Application",
    description:
      "Get in touch with our team for support, inquiries, or feedback",
    type: "website",
    locale: "en_US",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

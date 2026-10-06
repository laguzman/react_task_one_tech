export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  product: string;
};

/*
  SAMPLE CONTENT. These are placeholders written for the design. Replace them with real client
  quotes (and get the client's permission) before publishing. Keep each quote to about three lines.
*/
export const testimonials: Testimonial[] = [
  {
    quote: "Our loan files used to move between three tools. Now the whole journey sits in one place and nothing gets lost.",
    name: "Giulia Ferraro",
    role: "Head of Operations",
    company: "Orsini Credito",
    product: "KORE",
  },
  {
    quote: "Documents reach us in every format. ARGO reads them and hands over clean data, so the team stopped retyping.",
    name: "Marco Bellandi",
    role: "Practice Manager",
    company: "Studio Bellandi",
    product: "ARGO",
  },
  {
    quote: "WhatsApp, Instagram and email used to be separate inboxes. Now every customer has one thread we can follow.",
    name: "Chiara Locatelli",
    role: "Customer Care Lead",
    company: "Locatelli Servizi",
    product: "ALL MESSAGE",
  },
  {
    quote: "They started from our problem, not from a feature list, and we were live in a few weeks.",
    name: "Davide Conti",
    role: "Founder",
    company: "Conti Logistica",
    product: "Tailor Lab",
  },
];

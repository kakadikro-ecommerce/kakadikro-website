import type { ChatAnswer, QuickReply } from "@/types/chat";

export const greeting =
  "Hi, I can help with products, delivery, payment, tracking, and contact.";

export const quickReplies: QuickReply[] = [
  { id: "products", label: "Products", prompt: "What do you sell?" },
  { id: "delivery", label: "Delivery", prompt: "Where do you deliver?" },
  { id: "payment", label: "Payment", prompt: "How can I pay?" },
  { id: "track", label: "Track order", prompt: "Where is my order?" },
  { id: "contact", label: "Contact", prompt: "How do I contact you?" },
];

const email = "kakadikroproduct@gmail.com";

const emailLink = { href: `mailto:${email}`, label: email };
const contactLink = { href: "/contactUs", label: "Contact us" };
const trackLink = { href: "/trackOrder", label: "Track Order" };

export const answers = {
  products: {
    text: "Kaka Dikro has two lines. Cross Life is foods and spices, and Cross Line is agri equipment such as torches and water pumps.",
    links: [
      { href: "/products?type=CROSSLIFE", label: "Cross Life foods and spices" },
      { href: "/products?type=CROSSLINE", label: "Cross Line agri equipment" },
    ],
  },
  natural: {
    text: "Spices are sourced from farms in India and are free of preservatives, artificial colors, and additives.",
  },
  storage: {
    text: "Keep them in an airtight container, away from sunlight, heat, and moisture.",
  },
  deliveryArea: {
    text: "We deliver across Gujarat and all of India.",
  },
  deliveryTime: {
    text: "Delivery usually takes 3–5 business days in Gujarat and 5–7 days in other states. An exact date for a PIN code is not available.",
  },
  shippingCharge: {
    text: "The shipping charge is not published. The cart total shown at checkout is the product total.",
  },
  payment: {
    text: "You can pay online with UPI, card, or netbanking, or choose cash on delivery. Login is required to buy.",
  },
  account: {
    text: "Yes, you need an account to add to the cart and check out. Track Order can be opened from the link below.",
    links: [trackLink],
  },
  order: {
    text: "Open Track Order and enter your order id. Statuses are pending, confirmed, dispatched, delivered, or cancelled, and after dispatch the page shows a courier name and tracking ID only if the order has them.",
    links: [trackLink],
  },
  cancel: {
    text: "Yes, you can cancel only while the order is pending or confirmed, from Track Order. After dispatch, cancellation is not available.",
    links: [trackLink],
  },
  address: {
    text: "Yes, you can change the address only while the order is pending or confirmed, on Track Order.",
    links: [trackLink],
  },
  refund: {
    text: "A return or refund policy is not published. Please email kakadikroproduct@gmail.com.",
    links: [emailLink],
  },
  bulk: {
    text: "Yes, we take bulk orders for restaurants, shops, and wholesalers. Pricing is not listed, so please email kakadikroproduct@gmail.com or use the contact page.",
    links: [emailLink, contactLink],
  },
  contact: {
    text: "Email kakadikroproduct@gmail.com. Our address is Parvat Patiya, Surat, 395010, Gujarat.",
    links: [emailLink, contactLink],
  },
  price: {
    text: "Prices and stock are on each product page and are not available in chat.",
    links: [{ href: "/products", label: "View products" }],
  },
  greetingReply: {
    text: "Hello. I can help with products, delivery, payment, tracking, and contact.",
  },
  thanks: {
    text: "You are welcome. I can help with products, delivery, payment, tracking, and contact.",
  },
  bye: {
    text: "Goodbye. Open the chat again anytime for products, delivery, payment, tracking, or contact.",
  },
  fallback: {
    text: "That detail is not on the website. Email kakadikroproduct@gmail.com or visit the contact page.",
    links: [emailLink, contactLink],
  },
} satisfies Record<string, ChatAnswer>;

export type AnswerId = keyof typeof answers;

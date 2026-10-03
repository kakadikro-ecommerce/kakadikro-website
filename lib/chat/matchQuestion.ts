import type { ChatAnswer } from "@/types/chat";
import { answers, type AnswerId } from "@/lib/chat/knowledge";

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function answerFor(id: AnswerId): ChatAnswer {
  return answers[id];
}

export function matchQuestion(input: string): ChatAnswer {
  const text = normalize(input);
  if (!text) return answerFor("fallback");

  if (
    /\b(phone|mobile|whatsapp|gst|gstin|privacy|terms|timings)\b/.test(text) ||
    /\b(opening|support) hours\b/.test(text) ||
    /\b(contact|phone|mobile) number\b/.test(text) ||
    /\b(call|ring) (you|us)\b/.test(text)
  ) {
    return answerFor("fallback");
  }

  if (/\b(return|refund|exchange)\b/.test(text)) return answerFor("refund");
  if (/\bcancell?/.test(text)) return answerFor("cancel");

  if (
    /\b(change|update|edit|modify|correct)\b.{0,40}\baddress\b/.test(text) ||
    /\baddress\b.{0,40}\b(change|update|edit|modify|wrong)\b/.test(text)
  ) {
    return answerFor("address");
  }

  if (
    /\b(shipping|delivery) (charge|charges|fee|fees|cost|costs|rate|price)\b/.test(text) ||
    /\b(charge|charges|fee|fees|cost|price) (for )?(shipping|delivery)\b/.test(text) ||
    /\b(price|cost|fee|charge) of (the )?(shipping|delivery)\b/.test(text) ||
    /\bhow much\b.{0,40}\b(ship|deliver)/.test(text) ||
    /\b(ship|deliver)\w*.{0,40}\bhow much\b/.test(text) ||
    /\b(postage|free shipping)\b/.test(text)
  ) {
    return answerFor("shippingCharge");
  }

  if (
    /\bhow long\b/.test(text) ||
    /\bhow much time\b/.test(text) ||
    /\bhow soon\b/.test(text) ||
    /\b(delivery|shipping) (time|times)\b/.test(text) ||
    /\b(how many|business) days\b/.test(text) ||
    /\bwhen (will|does|can)\b/.test(text) ||
    /\b(pincode|pin code|postal code)\b/.test(text) ||
    /\bexact date\b/.test(text) ||
    /\b(delivery|shipping)\b.{0,30}\b(take|takes|days)\b/.test(text)
  ) {
    return answerFor("deliveryTime");
  }

  if (/\b(account|log ?in|sign ?in|sign ?up|register|registration)\b/.test(text)) {
    return answerFor("account");
  }

  if (/\b(payments?|pay|paying|upi|cards?|net ?banking|cod|cash on delivery)\b/.test(text)) {
    return answerFor("payment");
  }

  if (
    /\b(deliver|delivery|ship|shipping)\b/.test(text) ||
    /\bacross india\b/.test(text)
  ) {
    return answerFor("deliveryArea");
  }

  if (/\b(bulk|wholesale|wholesalers?|restaurants?|retailers?)\b/.test(text)) {
    return answerFor("bulk");
  }

  if (
    /\b(track|tracking|courier|dispatched|shipment)\b/.test(text) ||
    /\b(order status|order number|my order|where is my order)\b/.test(text)
  ) {
    return answerFor("order");
  }

  if (
    /\b(storage|airtight)\b/.test(text) ||
    /\bhow (should|do|to) (i )?(store|keep)\b/.test(text) ||
    /\b(store|keep) (the |my |your )?(spices?|masalas?)\b/.test(text)
  ) {
    return answerFor("storage");
  }

  if (
    /\b(natural|preservatives?|artificial|additives?)\b/.test(text) ||
    /\bsourced from\b/.test(text)
  ) {
    return answerFor("natural");
  }

  if (/\b(prices?|costs?|how much|mrp|stocks?|in stock|out of stock)\b/.test(text)) {
    return answerFor("price");
  }

  if (
    /\b(products?|sell|selling|spices?|masalas?|grocery|electronics|equipment|torches?|pumps?)\b/.test(text) ||
    /\bcross (life|line)\b/.test(text) ||
    /\bwhat do you (sell|have|offer)\b/.test(text)
  ) {
    return answerFor("products");
  }

  if (
    /\b(contact|email|e mail|surat|parvat)\b/.test(text) ||
    /\b(where are you|shop address|your address|office address)\b/.test(text) ||
    /\b(location|located)\b/.test(text)
  ) {
    return answerFor("contact");
  }

  if (/^(thanks|thank you|thankyou)( a lot| so much)?$/.test(text)) {
    return answerFor("thanks");
  }

  if (/^(bye|goodbye|good bye|see you|see ya)$/.test(text)) {
    return answerFor("bye");
  }

  if (isGreeting(text)) return answerFor("greetingReply");

  return answerFor("fallback");
}

function isGreeting(text: string): boolean {
  const leftover = text
    .replace(/\b(hi|hello|hey|heya|hiya|howdy|hola|namaste|namaskar|greetings|there|kaka|dikro|please|ok|okay)\b/g, " ")
    .replace(/\bgood (morning|afternoon|evening|day)\b/g, " ")
    .replace(/\b(how are you|whats up)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const hasGreeting =
    /\b(hi|hello|hey|heya|hiya|howdy|hola|namaste|namaskar|greetings|how are you|whats up)\b/.test(text) ||
    /\bgood (morning|afternoon|evening|day)\b/.test(text);

  return hasGreeting && leftover.length === 0;
}

import { config, copy, menu, type MenuItem } from "../config";

export type Basket = Record<string, number>;

export interface BasketLine {
  item: MenuItem;
  qty: number;
  total: number;
}

export const formatPrice = (rand: number) => `R${rand}`;

/** Description with any [PLACEHOLDER] removed: "[FILLINGS] · the full stack" → "the full stack", "[FILLINGS]" → "". */
export const displayDescription = (description: string) =>
  description
    .replace(/\[[^\]]*\]/g, "")
    .replace(/^[\s·]+|[\s·]+$/g, "")
    .trim();

export function basketLines(basket: Basket): BasketLine[] {
  return menu
    .filter((item) => (basket[item.id] ?? 0) > 0)
    .map((item) => ({ item, qty: basket[item.id], total: item.price * basket[item.id] }));
}

export const basketTotal = (lines: BasketLine[]) => lines.reduce((sum, l) => sum + l.total, 0);
export const basketCount = (lines: BasketLine[]) => lines.reduce((sum, l) => sum + l.qty, 0);

export const whatsappLink = (text: string) =>
  `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`;

export function orderMessage(opts: { name: string; pickup: string; lines: BasketLine[]; note: string }) {
  const m = copy.preorder.message;
  const rows = [
    m.greeting,
    `${m.name} ${opts.name}`,
    `${m.pickup} ${opts.pickup}`,
    m.divider,
    ...opts.lines.map((l) => `${l.qty} × ${l.item.name} — ${formatPrice(l.total)}`),
    m.divider,
    `${m.total} ${formatPrice(basketTotal(opts.lines))} ${m.totalSuffix}`,
  ];
  if (opts.note) rows.push(`${m.note} ${opts.note}`);
  return rows.join("\n");
}

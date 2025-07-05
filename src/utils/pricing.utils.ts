import { VAT_RATE } from "@/constants";
import { round } from "lodash";

export function computeTax(price: number) {
  const tax = price * (VAT_RATE / (100 + VAT_RATE));
  return parseFloat(round(tax, 2).toFixed(2));
}
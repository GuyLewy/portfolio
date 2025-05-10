import { twMerge } from 'tailwind-merge'
import clsx from "clsx";

export default function cn(...inputs: string[]) {
  // Merge class names
  return twMerge(clsx(inputs));
}
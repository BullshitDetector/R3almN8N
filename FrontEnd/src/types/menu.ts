import type { LucideProps } from 'lucide-react'; // Type-only for props (strips to JS)

export interface MenuItem {
  label: string;
  href?: string;
  icon?: (props: LucideProps) => JSX.Element; // Typed as icon component fn (e.g., Home from lucide-react)
  children?: MenuItem[];
}
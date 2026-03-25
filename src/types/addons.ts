export interface Addon {
  id: string;
  name: string;
  price: number;
  type: "deliverable" | "service";
}
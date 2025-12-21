export type FodmapStatus = "low" | "medium" | "high";

export const FODMAP_STATUS_COLORS: Record<FodmapStatus, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export interface FodmapFood {
  name: string;
  status: FodmapStatus;
  category: string;
  notes?: string;
}

export const FODMAP_DATA: FodmapFood[] = [
  // Vegetables
  { name: "Asparagus", status: "high", category: "Vegetables", notes: "High in fructose and fructans" },
  { name: "Artichoke", status: "high", category: "Vegetables" },
  { name: "Broccoli (Heads)", status: "low", category: "Vegetables", notes: "Low at 3/4 cup" },
  { name: "Broccoli (Stems)", status: "high", category: "Vegetables" },
  { name: "Carrot", status: "low", category: "Vegetables" },
  { name: "Cucumber", status: "low", category: "Vegetables" },
  { name: "Eggplant", status: "low", category: "Vegetables" },
  { name: "Garlic", status: "high", category: "Vegetables", notes: "High in fructans" },
  { name: "Green Beans", status: "low", category: "Vegetables" },
  { name: "Kale", status: "low", category: "Vegetables" },
  { name: "Lettuce", status: "low", category: "Vegetables" },
  { name: "Mushroom (Button)", status: "high", category: "Vegetables", notes: "High in mannitol" },
  { name: "Mushroom (Oyster)", status: "low", category: "Vegetables" },
  { name: "Onion", status: "high", category: "Vegetables", notes: "High in fructans" },
  { name: "Potato", status: "low", category: "Vegetables" },
  { name: "Spinach", status: "low", category: "Vegetables" },
  { name: "Tomato", status: "low", category: "Vegetables" },
  { name: "Zucchini", status: "low", category: "Vegetables", notes: "Low at 1/3 cup" },

  // Fruits
  { name: "Apple", status: "high", category: "Fruits", notes: "High in fructose and sorbitol" },
  { name: "Banana (Ripe)", status: "medium", category: "Fruits", notes: "Low when firm/unripe" },
  { name: "Blueberries", status: "low", category: "Fruits", notes: "Low at 1 cup" },
  { name: "Grapes", status: "low", category: "Fruits" },
  { name: "Kiwi", status: "low", category: "Fruits" },
  { name: "Mango", status: "high", category: "Fruits", notes: "High in fructose" },
  { name: "Orange", status: "low", category: "Fruits" },
  { name: "Pear", status: "high", category: "Fruits", notes: "High in fructose and sorbitol" },
  { name: "Pineapple", status: "low", category: "Fruits" },
  { name: "Raspberries", status: "low", category: "Fruits", notes: "Low at 30 berries" },
  { name: "Strawberries", status: "low", category: "Fruits" },
  { name: "Watermelon", status: "high", category: "Fruits", notes: "High in fructose and mannitol" },

  // Grains & Legumes
  { name: "Bread (Wheat)", status: "high", category: "Grains", notes: "High in fructans" },
  { name: "Bread (Sourdough Spelt)", status: "low", category: "Grains" },
  { name: "Bread (Gluten-Free)", status: "low", category: "Grains" },
  { name: "Oats", status: "low", category: "Grains", notes: "Low at 1/2 cup" },
  { name: "Pasta (Wheat)", status: "high", category: "Grains" },
  { name: "Pasta (Gluten-Free)", status: "low", category: "Grains" },
  { name: "Rice", status: "low", category: "Grains" },
  { name: "Quinoa", status: "low", category: "Grains" },
  { name: "Beans (Black)", status: "high", category: "Legumes" },
  { name: "Chickpeas (Canned)", status: "medium", category: "Legumes", notes: "Low at 1/4 cup rinsed" },
  { name: "Lentils", status: "high", category: "Legumes" },

  // Dairy & Alternatives
  { name: "Milk (Cows)", status: "high", category: "Dairy", notes: "High in lactose" },
  { name: "Milk (Lactose-Free)", status: "low", category: "Dairy" },
  { name: "Milk (Almond)", status: "low", category: "Dairy" },
  { name: "Milk (Soy - from hulls)", status: "low", category: "Dairy" },
  { name: "Milk (Soy - from whole beans)", status: "high", category: "Dairy" },
  { name: "Cheese (Cheddar)", status: "low", category: "Dairy" },
  { name: "Cheese (Mozzarella)", status: "low", category: "Dairy" },
  { name: "Yogurt (Regular)", status: "high", category: "Dairy" },

  // Proteins
  { name: "Beef", status: "low", category: "Proteins" },
  { name: "Chicken", status: "low", category: "Proteins" },
  { name: "Eggs", status: "low", category: "Proteins" },
  { name: "Fish", status: "low", category: "Proteins" },
  { name: "Tofu (Firm)", status: "low", category: "Proteins" },
  { name: "Tofu (Silken)", status: "high", category: "Proteins" },

  // Sweeteners & Others
  { name: "Honey", status: "high", category: "Sweeteners", notes: "High in fructose" },
  { name: "Maple Syrup", status: "low", category: "Sweeteners" },
  { name: "Sugar (White)", status: "low", category: "Sweeteners" },
  { name: "Agave Nectar", status: "high", category: "Sweeteners" },
  { name: "Cashews", status: "high", category: "Nuts" },
  { name: "Walnuts", status: "low", category: "Nuts" },
  { name: "Almonds", status: "medium", category: "Nuts", notes: "Low at 10 nuts" },
];

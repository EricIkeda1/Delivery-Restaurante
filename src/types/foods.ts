export type FoodRecipe = {
  id: string;
  name: string;
  image: string;
  category: string;
  area: string;
  ingredients: string[];
  source: "TheMealDB";
};
export type FoodSearch = {
  foods: FoodRecipe[];
  source: "TheMealDB";
  query: string;
};

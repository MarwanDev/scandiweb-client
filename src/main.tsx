import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { fetchAllCategories } from "./services/categoryService";
import type { Category } from "./graphql/types/category.types";

async function bootstrap() {
  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);

  try {
    const fallbackCategories = [
      { id: 1, name: "all" },
      { id: 2, name: "clothes" },
      { id: 3, name: "tech" },
    ];
    const categories: Category[] =
      (await fetchAllCategories().catch(() => fallbackCategories)) ||
      fallbackCategories;
    if (categories && categories.length > 0) {
      root.render(
        <StrictMode>
          <App initialCategories={categories ?? []} />
        </StrictMode>
      );
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    root.render(
      <StrictMode>
        <div>Failed to load categories.</div>
      </StrictMode>
    );
  }
}

bootstrap();

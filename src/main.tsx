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
    const categories: Category[] = await fetchAllCategories();
    root.render(
      <StrictMode>
        <App initialCategories={categories} />
      </StrictMode>
    );
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

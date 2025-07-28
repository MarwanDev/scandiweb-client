import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components";
import "./App.css";
import type { Category } from "./graphql/types/category.types";

function App({ initialCategories }: { initialCategories: Category[] }) {
  return (
    <Router>
      <main>
        <Layout initialCategories={initialCategories}/>
      </main>
    </Router>
  );
}

export default App;

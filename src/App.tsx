import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components";
import "./App.css";
// import type { Category } from "./graphql/types/category.types";

function App() {
  return (
    <Router>
      <main>
        <Layout />
      </main>
    </Router>
  );
}

export default App;

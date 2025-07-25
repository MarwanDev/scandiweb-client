import { BrowserRouter as Router } from "react-router-dom";
import { Layout } from "./components";
import "./App.css";

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

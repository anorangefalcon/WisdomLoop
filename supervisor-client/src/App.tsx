import "./App.css";
import { HomeView } from "./components/HomeView";

function App() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medium mb-8">Supervisor Dashboard</h1>
        <HomeView />
      </div>
    </div>
  );
}

export default App;

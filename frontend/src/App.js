import "./App.css";
import { Routers } from "./components";
import { AuthProvider } from "./contexts/AuthContext/AuthContext";
import { DataProvider } from "./contexts/DataContext/DataContext";

function App() {
  return (
    <div className="App vh-100">
      <AuthProvider>
        <DataProvider>
          <Routers />
        </DataProvider>
      </AuthProvider>
    </div>
  );
}

export default App;

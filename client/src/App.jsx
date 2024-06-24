import { EthProvider } from "./contexts/EthContext";
import Main from "./components/MainComponent";
import { HashRouter } from "react-router-dom";

function App() {
  return (
    <HashRouter basename="/">
      <EthProvider>
      <div id="App" className="App">
        <Main />
      </div>
      </EthProvider>
    </HashRouter>
  );
}

export default App;

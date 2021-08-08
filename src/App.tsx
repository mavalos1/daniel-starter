import AppProvider from "./contexts";
import AppRoutes from "./routes";

const App: React.FC = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;

import Login from "./Pages/Login"
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Login/>
    </QueryClientProvider>
  )
}

export default App

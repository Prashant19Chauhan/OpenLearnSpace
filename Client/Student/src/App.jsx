import Login from "./Pages/Login"
import Dashboard from "./Pages/Dashaboard"
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import SubjectDetails from "./Components/SubjectDetails";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {useSelector} from "react-redux";
import Overview from "./Components/Dashboard/Overview";
import Academics from "./Components/Dashboard/Academics";
import Communication from "./Components/Dashboard/Communication";
import Profile from "./Components/Dashboard/Profile";
import Salary from "./Components/Dashboard/Salary";
import Statistics from "./Components/Dashboard/Statistics";

function App() {
  const queryClient = new QueryClient();
  const { isLoggedIn } = useSelector((state) => state.user.auth);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLoggedIn? <Navigate to={'/'}/>: <Login/>}/>
          <Route
            path="/"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route index element={<Overview/>}/>
            <Route path="academics" element={<Academics/>}/>
            <Route path="communication" element={<Communication/>}/>
            <Route path="profile" element={<Profile/>}/>
            <Route path="salary" element={<Salary/>}/>
            <Route path="statistics" element={<Statistics/>}/>
            <Route path="/academics/batch/:batchId/subject/:subjectId" element={<SubjectDetails/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

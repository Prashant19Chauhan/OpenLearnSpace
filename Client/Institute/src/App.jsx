import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from './Pages/Dashaboard';
import Login from './Pages/Login';
import Overview from './Components/Dashboard/Overview';
import Teacher from './Components/Dashboard/Teacher';
import Student from './Components/Dashboard/Student';
import Management from './Components/Dashboard/Management';
import Academics from './Components/Dashboard/Academics';
import Communication from './Components/Dashboard/Communication';
import Finance from './Components/Dashboard/Finance';
import Content from './Components/Dashboard/Content';
import Profile from './Components/Dashboard/Profile';
import Examination from './Components/Dashboard/Examination';
import TeacherProfile from './Components/Models/TeacherProfile';
import StudentProfile from './Components/Models/StudentProfile';
import AddEmployee from './Components/Models/AddEmployee';
import EmployeeDetailPage from './Components/Models/EmployeeDetails';
import ProgramDetail from './Components/Dashboard/Academics/ProgramDetails';
import BatchDetail from './Components/Dashboard/Academics/BatchDetails';

function App() {
  const { isLoggedIn } = useSelector((state) => state.user.auth);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login/:id"
            element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route index element={<Overview />} />
            <Route path="teacher" element={<Teacher />} />
            <Route path="teacher/:id" element={<TeacherProfile />} />
            <Route path="student" element={<Student />} />
            <Route path="student/:id" element={<StudentProfile />} />
            <Route path="management" element={<Management />} />
            <Route path="management/addEmployee" element={<AddEmployee />} />
            <Route
              path="management/employeeDetails/:id"
              element={<EmployeeDetailPage />}
            />
            <Route path="academics" element={<Academics />} />
            <Route path="academics/program/:id" element={<ProgramDetail />} />
            <Route
              path="academics/program/:programId/batch/:batchId"
              element={<BatchDetail />}
            />
            <Route path="communication" element={<Communication />} />
            <Route path="finance" element={<Finance />} />
            <Route path="content" element={<Content />} />
            <Route path="examination" element={<Examination/>}/>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

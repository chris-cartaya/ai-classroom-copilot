import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import StudentView from "./pages/StudentView";
import InstructorView from "./pages/InstructorView";
import CourseMaterials from "./pages/CourseMaterials";
import AccountSettings from "./pages/AccountSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentView />} />
        <Route path="/instructor" element={<InstructorView />} />
        <Route path="/course-materials" element={<CourseMaterials />} />
        <Route path="/settings" element={<AccountSettings />} />
      </Routes>
    </Router>
  );
}

export default App;

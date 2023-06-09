import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./pages/root";
import Applicants from "./pages/applicants";
import Roles from "./pages/roles";
import LandingPage from "./pages/landingPage";
import Applicant from "./pages/applicant";
import Role from "./pages/role";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Root />}>
          <Route path="" element={<LandingPage />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="applicant/:id" element={<Applicant />} />
          <Route path="roles" element={<Roles />} />
          <Route path="role/:id" element={<Role />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

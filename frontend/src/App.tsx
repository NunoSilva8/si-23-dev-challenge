import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./pages/root";
import Applicants from "./pages/applicants";
import Roles from "./pages/roles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Root />}>
          <Route path="applicants" element={<Applicants />}></Route>
          <Route path="roles" element={<Roles />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ResultPage from "@/pages/result";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<ResultPage />} path="/result" />
    </Routes>
  );
}

export default App;

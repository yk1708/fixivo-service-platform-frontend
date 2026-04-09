import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainScreen from "../pages/MainScreen";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/login" element={<h1>Login</h1>} />
      </Routes>
    </BrowserRouter>
  );
}
import { Routes, Route } from "react-router-dom";
import Cliente from "./pages/Cliente";
import Produto from "./pages/Produto";
import Login from "./pages/Login";
import Administrador from "./pages/Administrador";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cliente" element={<><header><h1>🏪 Loja</h1></header><Cliente /></>} />
        <Route path="/produto/:id" element={<><header><h1>🏪 Loja</h1></header><Produto /></>} />
        <Route path="/admin" element={<Administrador />} />
      </Routes>
    </>
  );
}
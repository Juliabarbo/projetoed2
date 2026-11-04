import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatarPreco } from "../produtos";

export default function Cliente() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend retorna os produtos cadastrados no banco H2.
    fetch("http://localhost:8080/api/produtos").then(r => r.json()).then(setProdutos);
  }, []);

  return (
    <div className="container">
      <div className="titulo-produtos">
        <div>
          <h2>Produtos</h2>
          <p className="sub">Escolha um produto para ver os detalhes.</p>
        </div>
        <button className="sair" type="button" onClick={() => navigate("/")}>← Sair</button>
      </div>

      <div className="grid">
        {produtos.map((p) => (
          <Link key={p.id} to={`/produto/${p.id}`} className="card-produto">
            <img src={p.imagem} alt={p.nome} />
            <div className="corpo">
              <h3>{p.nome}</h3>
              <div className="preco">{formatarPreco(p.preco)}</div>
              <div className="ver">Ver produto</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
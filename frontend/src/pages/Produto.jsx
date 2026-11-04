import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatarPreco } from "../produtos";

const API = "http://localhost:8080/api";

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [relacionados, setRelacionados] = useState([]);
  const [mensagemCompra, setMensagemCompra] = useState("");

  useEffect(() => {
    // Busca o produto, relacionados e registra o acesso na pilha do histórico.
    fetch(`${API}/produtos/${id}`).then(r => r.ok ? r.json() : null).then(setProduto);
    fetch(`${API}/produtos/${id}/relacionados`).then(r => r.json()).then(setRelacionados);
    fetch(`${API}/historico/${id}`, { method: "POST" });              // pilha: push
  }, [id]);

  const voltar = async () => {
    const { anterior } = await fetch(`${API}/historico/voltar`, { method: "POST" }).then(r => r.json());
    navigate(anterior ? `/produto/${anterior.id}` : "/cliente");      // pilha: pop
  };

  const comprar = async () => {
    // Adiciona o produto à fila de pedidos e mostra a confirmação na tela.
    await fetch(`${API}/pedidos/${id}`, { method: "POST" });
    setMensagemCompra("Compra feita com sucesso");
  };

  if (!produto) return <div className="container"><p>Produto não encontrado.</p></div>;

  return (
    <div className="container">
      <button className="voltar" onClick={voltar}>&larr; Voltar</button>
      <div className="card-detalhe">
        <div className="imagem"><img src={produto.imagem} alt={produto.nome} /></div>
        <div className="info">
          <h1>{produto.nome}</h1>
          <p>{produto.descricao}</p>
          <div className="preco grande">{formatarPreco(produto.preco)}</div>
          <button className="comprar" onClick={comprar}>Comprar</button>
          {mensagemCompra && <p className="compra-sucesso">Compra feita com sucesso!</p>}
        </div>
      </div>

      <h3 style={{ margin: "24px 0 12px" }}>Produtos relacionados</h3>
      <div className="grid">
        {relacionados.map(r => (
          <div key={r.id} className="card-produto" onClick={() => navigate(`/produto/${r.id}`)} style={{ cursor: "pointer" }}>
            <img src={r.imagem} alt={r.nome} />
            <div className="corpo"><h3>{r.nome}</h3><div className="preco">{formatarPreco(r.preco)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
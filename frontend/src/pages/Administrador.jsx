import { useEffect, useState } from "react";

const API = "http://localhost:8080/api/produtos";

export default function Administrador() {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");

  async function carregarProdutos() {
    const resposta = await fetch(API);
    if (resposta.ok) setProdutos(await resposta.json());
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function adicionar(event) {
    event.preventDefault();
    const nomeLimpo = nome.trim();
    const precoNumero = Number(preco);
    if (!nomeLimpo || preco === "" || precoNumero < 0) return;

    const resposta = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeLimpo, preco: precoNumero }),
    });
    if (!resposta.ok) return;

    setNome("");
    setPreco("");
    carregarProdutos();
  }

  async function remover(id) {
    const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (resposta.ok) carregarProdutos();
  }

  function formatarPreco(valor) {
    return `R$ ${Number(valor).toFixed(2).replace(".", ",")}`;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">Loja - Administrador</header>
      <main className="admin-main">
        <section className="admin-card">
          <h1>Mercadorias</h1>
          <p className="admin-descricao">Adicione ou remova produtos.</p>

          <form className="admin-form" onSubmit={adicionar}>
            <input
              type="text"
              placeholder="Nome do produto"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Preço (R$)"
              value={preco}
              onChange={(event) => setPreco(event.target.value)}
              required
            />
            <button type="submit">Adicionar</button>
          </form>

          <ul className="admin-lista">
            {produtos.length === 0 && (
              <li className="admin-vazio">Nenhum produto cadastrado.</li>
            )}
            {produtos.map((produto) => (
              <li key={produto.id}>
                <span>
                  {produto.nome}
                  <span className="admin-preco">{formatarPreco(produto.preco)}</span>
                </span>
                <button className="admin-remover" type="button" onClick={() => remover(produto.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

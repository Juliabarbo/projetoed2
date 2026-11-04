import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [popupAberto, setPopupAberto] = useState(false);
  const navigate = useNavigate();

  async function entrar(event) {
    event.preventDefault();
    setErro("");

    // Envia e-mail e senha ao backend para validação no banco H2.
    const resposta = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!resposta.ok) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    setPopupAberto(true);
  }

  return (
    <>
      <header><h1>🏪 Loja</h1></header>
      <main>
        <form className="login-card card" onSubmit={entrar}>
          <h1>Faça o seu login</h1>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required />
          {erro && <p className="erro">{erro}</p>}
          <button className="btn login-btn" type="submit">Entrar</button>
        </form>
      </main>

      {popupAberto && (
        <div className="popup aberto" role="dialog" aria-modal="true">
          <div className="card popup-card">
            <h1>Para onde você quer ir?</h1>
            <button className="btn" type="button" onClick={() => navigate("/admin")}>Produto</button>
            <button className="btn" type="button" onClick={() => navigate("/cliente")}>Tela de cliente</button>
          </div>
        </div>
      )}
    </>
  );
}

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const produtos = [
  {
    id: 1,
    nome: 'Fone de Ouvido Bluetooth',
    preco: 249.9,
    imagem: 'https://picsum.photos/id/1/500/500',
    descricao:
      'Fone sem fio com cancelamento de ruído, bateria de até 30 horas, microfone embutido e design confortável para uso prolongado.'
  },
  {
    id: 2,
    nome: 'Smartwatch Fit',
    preco: 399.9,
    imagem: 'https://picsum.photos/id/20/500/500',
    descricao:
      'Relógio inteligente com monitor de batimentos, GPS, resistência à água e notificações do celular.'
  },
  {
    id: 3,
    nome: 'Mochila para Notebook',
    preco: 159.9,
    imagem: 'https://picsum.photos/id/26/500/500',
    descricao:
      'Mochila resistente à água com compartimento acolchoado para notebook de até 15,6 polegadas.'
  },
  {
    id: 4,
    nome: 'Teclado Mecânico',
    preco: 329.9,
    imagem: 'https://picsum.photos/id/60/500/500',
    descricao:
      'Teclado mecânico com switches azuis, iluminação RGB e estrutura em alumínio.'
  }
];

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend funcionando corretamente.'
  });
});

app.get('/api/produtos', (req, res) => {
  res.status(200).json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const produto = produtos.find((item) => item.id === Number(id));

  if (!produto) {
    return res.status(404).json({ message: 'Produto não encontrado.' });
  }

  return res.status(200).json(produto);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

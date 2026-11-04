package com.projetoed;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {
    private final UsuarioRepository usuarios;
    private final ProdutoRepository produtosRepository;
    // Pilha em memória usada pelo botão Voltar da tela de produto.
    private final Deque<Integer> historico = new ArrayDeque<>();
    // Fila em memória usada ao adicionar pedidos ao comprar.
    private final Map<Integer, List<Integer>> pedidos = new ConcurrentHashMap<>();

    public ApiController(UsuarioRepository usuarios, ProdutoRepository produtosRepository) {
        this.usuarios = usuarios;
        this.produtosRepository = produtosRepository;
    }

    @Bean
    CommandLineRunner criarClientePadrao() {
        return args -> {
            // Cria ou atualiza o login simples do cliente no banco H2.
            var usuario = usuarios.findByEmail("cliente@hotmail.com");
            if (usuario.isPresent()) {
                usuario.get().setSenha("123");
                usuarios.save(usuario.get());
            } else {
                usuarios.save(new Usuario("cliente@hotmail.com", "123"));
            }

            // Cadastra os produtos uma vez; nas próximas inicializações apenas mantêm os dados existentes.
            if (produtosRepository.count() == 0) {
                produtosRepository.saveAll(List.of(
                    new Produto(1, "Fone de Ouvido Bluetooth", 249.9, "https://picsum.photos/id/1/500/500", "Fone sem fio com cancelamento de ruído e bateria de até 30 horas."),
                    new Produto(2, "Smartwatch Fit", 399.9, "https://picsum.photos/id/20/500/500", "Relógio inteligente com monitor de batimentos, GPS e resistência à água."),
                    new Produto(3, "Mochila para Notebook", 159.9, "https://picsum.photos/id/26/500/500", "Mochila resistente à água com compartimento acolchoado para notebook."),
                    new Produto(4, "Teclado Mecânico", 329.9, "https://picsum.photos/id/60/500/500", "Teclado mecânico com switches azuis, iluminação RGB e estrutura em alumínio.")
                ));
            }
        };
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        var usuario = usuarios.findByEmail(dados.getOrDefault("email", ""));

        if (usuario.isEmpty() || !usuario.get().getSenha().equals(dados.getOrDefault("senha", ""))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciais inválidas"));
        }

        return ResponseEntity.ok(Map.of("message", "Login realizado"));
    }

    @GetMapping("/produtos")
    public List<Produto> listarProdutos() {
        // Lista consumida pelos cards da página de opções de produtos.
        return produtosRepository.findAll();
    }

    @PostMapping("/produtos")
    public Produto adicionarProduto(@RequestBody Map<String, Object> dados) {
        String nome = String.valueOf(dados.getOrDefault("nome", "")).trim();
        double preco = Double.parseDouble(String.valueOf(dados.get("preco")));
        int novoId = produtosRepository.findAll().stream()
            .mapToInt(Produto::getId)
            .max()
            .orElse(0) + 1;

        return produtosRepository.save(new Produto(
            novoId,
            nome,
            preco,
            "https://picsum.photos/seed/produto" + novoId + "/500/500",
            ""
        ));
    }

    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<?> removerProduto(@PathVariable int id) {
        if (!produtosRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtosRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/produtos/{id}")
    public ResponseEntity<?> buscarProduto(@PathVariable int id) {
        return produtosRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/produtos/{id}/relacionados")
    public List<Produto> produtosRelacionados(@PathVariable int id) {
        // Exclui o produto atual da lista de produtos relacionados.
        return produtosRepository.findAll().stream()
            .filter(produto -> !produto.getId().equals(id))
            .toList();
    }

    @PostMapping("/historico/{id}")
    public void adicionarHistorico(@PathVariable int id) {
        historico.removeLastOccurrence(id);
        historico.addLast(id);
    }

    @PostMapping("/historico/voltar")
    public Map<String, Object> voltarHistorico() {
        if (!historico.isEmpty()) {
            historico.removeLast();
        }
        if (historico.isEmpty()) {
            return Map.of("anterior", null);
        }
        int id = historico.peekLast();
        return Map.of("anterior", Map.of("id", id));
    }

    @PostMapping("/pedidos/{id}")
    public Map<String, Integer> adicionarPedido(@PathVariable int id) {
        var fila = pedidos.computeIfAbsent(id, chave -> new java.util.ArrayList<>());
        fila.add(id);
        return Map.of("posicao", fila.size());
    }

}

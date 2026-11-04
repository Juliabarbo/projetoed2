package com.projetoed;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Produto {
    @Id
    private Integer id;

    @Column(nullable = false)
    private String nome;

    private double preco;
    private String imagem;

    @Column(length = 1000)
    private String descricao;

    protected Produto() {
    }

    public Produto(Integer id, String nome, double preco, String imagem, String descricao) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.imagem = imagem;
        this.descricao = descricao;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public double getPreco() {
        return preco;
    }

    public String getImagem() {
        return imagem;
    }

    public String getDescricao() {
        return descricao;
    }
}

CREATE DATABASE IF NOT EXISTS gerenciamento_restaurantes;
USE gerenciamento_restaurantes;

-- 1. Criação da tabela de restaurantes
CREATE TABLE IF NOT EXISTS restaurantes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    comentario VARCHAR(500) DEFAULT NULL,
    economia DECIMAL(18,5) DEFAULT NULL,
    avaliacao DECIMAL(18,5) NOT NULL,
    data_visita DATE DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_restaurante_nome (nome),
    CONSTRAINT chk_economia CHECK (economia BETWEEN 0 AND 1000000),
    CONSTRAINT chk_avaliacao CHECK (avaliacao BETWEEN 0 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Inserção de dados iniciais para testes
INSERT INTO restaurantes (nome, endereco, comentario, economia, avaliacao, data_visita) VALUES
('Bistrô Le Parisien', 'Av. Paulista, 1500 - Bela Vista', 'Pratos sofisticados, ambiente aconchegante para casais.', 10.00, 4.9, '2026-02-02'),
('Sushi Express', 'Rua Japão, 88 - Liberdade', 'Serviço rápido, peixe muito fresco e boa variedade no rodízio.', 30.00, 4.5, '2026-02-20'),
('Pizzeria Don Corleone', 'Rua Treze de Maio, 450 - Bixiga', 'Pizza de fermentação natural incrível, borda bem recheada.', 15.00, 4.7, '2026-03-05'),
('Steakhouse Boi Na Brasa', 'Av. das Nações, 2300 - Jardins', 'Cortes de carne no ponto certo, farofa e acompanhamentos ótimos.', 85.90, 4.6, '2026-03-12'),
('Burger & Beer Craft', 'Rua Augusta, 910 - Consolação', 'Hambúrguer artesanal suculento e ótima seleção de cervejas.', 22.50, 4.3, '2026-03-18'),
('Taverna do Mar', 'Av. Beira Mar, 50 - Praia Grande', 'Frutos do mar bem servidos e tempero caseiro muito gostoso.', 60.00, 4.2, '2026-03-25')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

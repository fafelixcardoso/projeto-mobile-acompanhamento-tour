# Acompanhamento Tour Londrina - Mobile

Aplicativo mobile desenvolvido para acompanhamento de visitas e economia em restaurantes do **Tour Londrina**, integrando um front-end em **React Native (Expo)** com um back-end RESTful em **Java com Spring Boot** e persistência no **MySQL**.

Trabalho prático desenvolvido para a disciplina de **Laboratório de Programação (4º Bimestre)** do curso de **Ciência de Dados e Inteligência Artificial — UEL**.

---

## Integrantes da Dupla
* **Fabrício Cardoso**
* **Guilherme T. da Silva**

---

## Tecnologias Utilizadas

* **Back-end:** Java 25, Spring Boot 3.x, Spring Data JPA, Hibernate, Bean Validation
* **Front-end:** React Native, Expo (SDK 58), React Navigation (Native Stack), Axios
* **Banco de Dados:** MySQL 8.0
* **Arquitetura:** RESTful API (JSON) + Client-Side Rendering nativo

---

## Funcionalidades
1. **Cadastro de Restaurantes:** Inserção com validação de campos obrigatórios e opcionais.
2. **Listagem com FlatList:** Exibição dos cards com nome, endereço, economia, avaliação e data formatada (`DD/MM/AAAA`).
3. **Edição:** Atualização de dados com formulário pré-preenchido.
4. **Exclusão:** Remoção com confirmação através de diálogo nativo.
5. **Pesquisa ao Vivo:** Busca por nome com *debounce* (300ms) sem travar a interface.
6. **Ordenação Dinâmica:** Ordenação por Nome, Nota e Economia em ordem crescente e decrescente diretamente no banco de dados.

---

## Pré-requisitos
* **Java JDK** (versão 21 ou superior)
* **Node.js** (versão LTS recomendada: 22 ou superior)
* **MySQL Server** (porta 3306)
* Celular com o aplicativo **Expo Go** instalado (Android ou iOS) conectado à mesma rede Wi-Fi do computador (ou emulador/navegador).

---

## Como Executar o Projeto

### 1. Configuração do Banco de Dados (MySQL)
No MySQL Workbench ou terminal MySQL, execute o script disponível no arquivo [`restaurantes.sql`](restaurantes.sql) ou rode os comandos abaixo:

```sql
CREATE DATABASE IF NOT EXISTS gerenciamento_restaurantes;
USE gerenciamento_restaurantes;

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

-- Dados iniciais para testes
INSERT INTO restaurantes (nome, endereco, comentario, economia, avaliacao, data_visita) VALUES
('Bistrô Le Parisien', 'Av. Paulista, 1500 - Bela Vista', 'Pratos sofisticados, ambiente aconchegante para casais.', 10.00, 4.9, '2026-02-02'),
('Sushi Express', 'Rua Japão, 88 - Liberdade', 'Serviço rápido, peixe muito fresco e boa variedade no rodízio.', 30.00, 4.5, '2026-02-20'),
('Pizzeria Don Corleone', 'Rua Treze de Maio, 450 - Bixiga', 'Pizza de fermentação natural incrível, borda bem recheada.', 15.00, 4.7, '2026-03-05'),
('Steakhouse Boi Na Brasa', 'Av. das Nações, 2300 - Jardins', 'Cortes de carne no ponto certo, farofa e acompanhamentos ótimos.', 85.90, 4.6, '2026-03-12'),
('Burger & Beer Craft', 'Rua Augusta, 910 - Consolação', 'Hambúrguer artesanal suculento e ótima seleção de cervejas.', 22.50, 4.3, '2026-03-18'),
('Taverna do Mar', 'Av. Beira Mar, 50 - Praia Grande', 'Frutos do mar bem servidos e tempero caseiro muito gostoso.', 60.00, 4.2, '2026-03-25')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);
```

Caso a senha do seu MySQL seja diferente da configurada, ajuste em `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
```

---

### 2. Executando o Back-end (Spring Boot)
Abra um terminal na pasta raiz do projeto:

```bash
cd Backend
```

Execute o comando Maven correspondente ao seu sistema:

* **Windows:**
  ```cmd
  .\mvnw.cmd spring-boot:run
  ```
* **Linux / macOS:**
  ```bash
  ./mvnw spring-boot:run
  ```

*(Ou simplesmente execute a classe `AcompTourApplication.java` na sua IDE de preferência: IntelliJ IDEA, Eclipse ou VS Code).*

O servidor iniciará na porta **8080**. A rota base da API estará disponível em:
`http://localhost:8080/api/restaurantes`

---

### 3. Executando o Front-end (React Native + Expo)

#### a) Configuração do IP da API
Para o smartphone físico conseguir se comunicar com o back-end, abra o arquivo `Frontend/src/services/api.js` e confirme se o IP corresponde ao IPv4 da sua máquina na rede local Wi-Fi:

```javascript
const API_BASE_URL = "http://SEU_IP_LOCAL:8080/api";
```
*(Para descobrir seu IP no Windows, execute `ipconfig` no prompt e veja o endereço IPv4).*

#### b) Instalação das Dependências e Inicialização
Em um novo terminal, entre na pasta do front-end:

```bash
cd Frontend
npm install
npm start
```

#### c) Abrindo no Celular ou Navegador
* **No Celular (Recomendado):** Abra o app **Expo Go**, aponte a câmera para o QR Code exibido no terminal e aguarde o carregamento do bundle JavaScript.
* **No Navegador Web:** No terminal onde o Expo está rodando, pressione a tecla `w`.

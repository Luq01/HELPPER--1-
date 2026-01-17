o vco# Arquitetura de Integração - Sistema Helpper

## 📋 Visão Geral

Este documento explica como fazer a linkagem entre o cadastro do profissional e sua exibição no lobby para contratação.

---

## 🗄️ Estrutura de Banco de Dados Sugerida

### Tabela: `profissionais`
```sql
CREATE TABLE profissionais (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    profissao VARCHAR(50) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    foto_perfil VARCHAR(255),
    sobre_mim TEXT,
    disponibilidade VARCHAR(20) DEFAULT 'Imediata',
    verificado BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    avaliacao_media DECIMAL(2,1) DEFAULT 0.0,
    total_avaliacoes INT DEFAULT 0
);
```

### Tabela: `trabalhos_realizados`
```sql
CREATE TABLE trabalhos_realizados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    tipo ENUM('image', 'video') NOT NULL,
    arquivo_url VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);
```

### Tabela: `avaliacoes`
```sql
CREATE TABLE avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    cliente_nome VARCHAR(100) NOT NULL,
    nota DECIMAL(2,1) NOT NULL CHECK (nota >= 0 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);
```

### Tabela: `servicos_realizados`
```sql
CREATE TABLE servicos_realizados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    cliente_nome VARCHAR(100) NOT NULL,
    data_servico DATE,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);
```

### Tabela: `contratacoes`
```sql
CREATE TABLE contratacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    profissional_id INT NOT NULL,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_telefone VARCHAR(20) NOT NULL,
    cliente_email VARCHAR(100),
    descricao_servico TEXT NOT NULL,
    data_desejada DATE NOT NULL,
    horario_preferencial VARCHAR(20) NOT NULL,
    status ENUM('pendente', 'aceito', 'recusado', 'concluido') DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profissional_id) REFERENCES profissionais(id) ON DELETE CASCADE
);
```

---

## 🔄 Fluxo de Integração

### 1. **Cadastro do Profissional**

**Arquivo: `pages/cadastro.html` (ou criar `cadastro-profissional.html`)**

```html
<form id="cadastro-profissional-form">
    <input type="text" name="nome" required>
    <input type="email" name="email" required>
    <input type="password" name="senha" required>
    <input type="tel" name="telefone" required>
    <select name="profissao" required>
        <option value="Pedreiro">Pedreiro</option>
        <option value="Eletricista">Eletricista</option>
        <option value="Pintor">Pintor</option>
        <option value="Faxineira">Faxineira</option>
    </select>
    <input type="text" name="cidade" required>
    <select name="estado" required>
        <option value="MG">Minas Gerais</option>
        <!-- outros estados -->
    </select>
    <textarea name="sobre_mim"></textarea>
    <input type="file" name="foto_perfil" accept="image/*">
    <button type="submit">Cadastrar</button>
</form>
```

**JavaScript para enviar dados:**

```javascript
$('#cadastro-profissional-form').submit(function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    $.ajax({
        url: '/api/profissionais/cadastrar',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'perfil-profissional.html?id=' + response.profissional_id;
        },
        error: function(error) {
            alert('Erro ao cadastrar: ' + error.responseJSON.message);
        }
    });
});
```

---

### 2. **Backend - API de Cadastro**

**Arquivo: `api/profissionais/cadastrar.php` (exemplo em PHP)**

```php
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT);
    $telefone = $_POST['telefone'];
    $profissao = $_POST['profissao'];
    $cidade = $_POST['cidade'];
    $estado = $_POST['estado'];
    $sobre_mim = $_POST['sobre_mim'] ?? '';
    
    // Upload da foto de perfil
    $foto_perfil = null;
    if (isset($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] === 0) {
        $upload_dir = '../../uploads/perfis/';
        $file_extension = pathinfo($_FILES['foto_perfil']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $file_name;
        
        if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $upload_path)) {
            $foto_perfil = '/uploads/perfis/' . $file_name;
        }
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO profissionais 
            (nome, email, senha, telefone, profissao, cidade, estado, foto_perfil, sobre_mim) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $nome, $email, $senha, $telefone, $profissao, 
            $cidade, $estado, $foto_perfil, $sobre_mim
        ]);
        
        $profissional_id = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'profissional_id' => $profissional_id,
            'message' => 'Profissional cadastrado com sucesso!'
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao cadastrar: ' . $e->getMessage()
        ]);
    }
}
?>
```

---

### 3. **Perfil do Profissional - Upload de Trabalhos**

**Arquivo: `src/javascript/perfil-profissional.js`**

```javascript
// Upload de trabalhos realizados
$('#addWorkBtn').click(function() {
    $('#workUpload').click();
});

$('#workUpload').change(function() {
    const files = this.files;
    const formData = new FormData();
    
    // Pegar ID do profissional (da URL ou sessão)
    const profissionalId = new URLSearchParams(window.location.search).get('id');
    formData.append('profissional_id', profissionalId);
    
    for (let i = 0; i < files.length; i++) {
        formData.append('trabalhos[]', files[i]);
    }
    
    $.ajax({
        url: '/api/profissionais/upload-trabalhos',
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert('Trabalhos enviados com sucesso!');
            location.reload();
        },
        error: function(error) {
            alert('Erro ao enviar trabalhos');
        }
    });
});
```

**Backend: `api/profissionais/upload-trabalhos.php`**

```php
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $profissional_id = $_POST['profissional_id'];
    $upload_dir = '../../uploads/trabalhos/';
    
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $uploaded_files = [];
    
    foreach ($_FILES['trabalhos']['tmp_name'] as $key => $tmp_name) {
        $file_name = $_FILES['trabalhos']['name'][$key];
        $file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $new_file_name = uniqid() . '.' . $file_extension;
        $upload_path = $upload_dir . $new_file_name;
        
        // Determinar tipo (imagem ou vídeo)
        $image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $video_extensions = ['mp4', 'avi', 'mov', 'wmv'];
        
        $tipo = in_array($file_extension, $image_extensions) ? 'image' : 'video';
        
        if (move_uploaded_file($tmp_name, $upload_path)) {
            $file_url = '/uploads/trabalhos/' . $new_file_name;
            
            // Salvar no banco
            $stmt = $pdo->prepare("
                INSERT INTO trabalhos_realizados (profissional_id, tipo, arquivo_url) 
                VALUES (?, ?, ?)
            ");
            $stmt->execute([$profissional_id, $tipo, $file_url]);
            
            $uploaded_files[] = [
                'tipo' => $tipo,
                'url' => $file_url
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'files' => $uploaded_files
    ]);
}
?>
```

---

### 4. **Lobby - Buscar e Exibir Profissionais**

**Backend: `api/profissionais/listar.php`**

```php
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

$cidade = $_GET['cidade'] ?? null;
$profissao = $_GET['profissao'] ?? null;

$sql = "
    SELECT 
        p.id,
        p.nome,
        p.profissao,
        p.cidade,
        p.estado,
        p.foto_perfil,
        p.sobre_mim,
        p.disponibilidade,
        p.verificado,
        p.avaliacao_media,
        p.total_avaliacoes,
        CONCAT(p.cidade, ' - ', p.estado) as localizacao
    FROM profissionais p
    WHERE p.ativo = TRUE
";

$params = [];

if ($cidade) {
    $sql .= " AND p.cidade = ?";
    $params[] = $cidade;
}

if ($profissao) {
    $sql .= " AND p.profissao = ?";
    $params[] = $profissao;
}

$sql .= " ORDER BY p.verificado DESC, p.avaliacao_media DESC LIMIT 20";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $profissionais = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Buscar trabalhos de cada profissional
    foreach ($profissionais as &$prof) {
        $stmt_trabalhos = $pdo->prepare("
            SELECT tipo, arquivo_url 
            FROM trabalhos_realizados 
            WHERE profissional_id = ? 
            LIMIT 6
        ");
        $stmt_trabalhos->execute([$prof['id']]);
        $prof['trabalhos'] = $stmt_trabalhos->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        'success' => true,
        'profissionais' => $profissionais
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao buscar profissionais'
    ]);
}
?>
```

**Frontend: Atualizar `src/javascript/script.js`**

```javascript
// Carregar profissionais ao abrir a página
$(document).ready(function() {
    carregarProfissionais();
});

function carregarProfissionais(cidade = null, profissao = null) {
    let url = '/api/profissionais/listar.php?';
    
    if (cidade) url += 'cidade=' + encodeURIComponent(cidade) + '&';
    if (profissao) url += 'profissao=' + encodeURIComponent(profissao);
    
    $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
            if (response.success) {
                renderizarProfissionais(response.profissionais);
            }
        },
        error: function() {
            alert('Erro ao carregar profissionais');
        }
    });
}

function renderizarProfissionais(profissionais) {
    const grid = $('#professionals-grid');
    grid.empty();
    
    profissionais.forEach(function(prof) {
        // Gerar estrelas
        const estrelas = gerarEstrelas(prof.avaliacao_media);
        
        const card = `
            <div class="professional-card" 
                 data-id="${prof.id}"
                 data-about="${prof.sobre_mim || 'Profissional experiente'}"
                 data-works='${JSON.stringify(prof.trabalhos)}'>
                <div class="profile-header">
                    <div class="profile-photo">
                        <img src="${prof.foto_perfil || '../src/images perfil/modelo foto perfil.png'}" 
                             alt="${prof.nome}">
                    </div>
                    <div class="profile-info">
                        <h3>${prof.nome}</h3>
                        <p class="profession">${prof.profissao}</p>
                    </div>
                </div>
                <div class="rating">
                    <div class="stars">${estrelas}</div>
                    <span class="rating-count">${prof.avaliacao_media} (${prof.total_avaliacoes})</span>
                </div>
                <div class="card-detail">
                    <img src="../src/images perfil/maps.png" alt="Localização">
                    <span>${prof.localizacao}</span>
                </div>
                <div class="card-detail">
                    <img src="../src/images perfil/relogio.png" alt="Disponibilidade">
                    <span>Disponibilidade: ${prof.disponibilidade}</span>
                </div>
                ${prof.verificado ? `
                <div class="verified">
                    <img src="../src/images perfil/verificado.png" alt="Verificado">
                    <span>Verificado pelo Helpper</span>
                </div>
                ` : ''}
                <button class="hire-button">Contratar Serviço</button>
            </div>
        `;
        
        grid.append(card);
    });
    
    // Reativar event listeners
    $('.hire-button').off('click').on('click', function() {
        // Código do modal de contratação
    });
}

function gerarEstrelas(nota) {
    let estrelas = '';
    const notaInteira = Math.floor(nota);
    const temMeia = (nota % 1) >= 0.5;
    
    for (let i = 0; i < notaInteira; i++) {
        estrelas += '<i class="fa-solid fa-star"></i>';
    }
    
    if (temMeia) {
        estrelas += '<i class="fa-solid fa-star-half-stroke"></i>';
    }
    
    const estrelasVazias = 5 - notaInteira - (temMeia ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) {
        estrelas += '<i class="fa-regular fa-star"></i>';
    }
    
    return estrelas;
}

// Atualizar ao selecionar localização
$('.location-item').click(function() {
    const location = $(this).data('location');
    const cidade = location.split(' - ')[0];
    
    // Recarregar profissionais da cidade selecionada
    carregarProfissionais(cidade);
    
    // ... resto do código
});
```

---

### 5. **Salvar Contratação**

**Backend: `api/contratacoes/criar.php`**

```php
<?php
header('Content-Type: application/json');
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $profissional_id = $data['profissional_id'];
    $cliente_nome = $data['cliente_nome'];
    $cliente_telefone = $data['cliente_telefone'];
    $cliente_email = $data['cliente_email'] ?? null;
    $descricao_servico = $data['descricao_servico'];
    $data_desejada = $data['data_desejada'];
    $horario_preferencial = $data['horario_preferencial'];
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO contratacoes 
            (profissional_id, cliente_nome, cliente_telefone, cliente_email, 
             descricao_servico, data_desejada, horario_preferencial) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $profissional_id, $cliente_nome, $cliente_telefone, $cliente_email,
            $descricao_servico, $data_desejada, $horario_preferencial
        ]);
        
        // Enviar notificação ao profissional (email, SMS, etc.)
        
        echo json_encode([
            'success' => true,
            'message' => 'Contratação solicitada com sucesso!'
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erro ao criar contratação'
        ]);
    }
}
?>
```

**Atualizar JavaScript do formulário:**

```javascript
$('#hire-form').submit(function(e) {
    e.preventDefault();
    
    const profissionalId = selectedProfessional.id; // Adicionar ID ao objeto
    
    const formData = {
        profissional_id: profissionalId,
        cliente_nome: $('#contact-name').val(),
        cliente_telefone: $('#contact-phone').val(),
        cliente_email: $('#contact-email').val(),
        descricao_servico: $('#service-description').val(),
        data_desejada: $('#service-date').val(),
        horario_preferencial: $('#service-time').val()
    };
    
    $.ajax({
        url: '/api/contratacoes/criar.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function(response) {
            alert('Solicitação enviada com sucesso!');
            closeModal();
        },
        error: function() {
            alert('Erro ao enviar solicitação');
        }
    });
});
```

---

## 📁 Estrutura de Arquivos Sugerida

```
projeto/
├── api/
│   ├── config/
│   │   └── database.php
│   ├── profissionais/
│   │   ├── cadastrar.php
│   │   ├── listar.php
│   │   └── upload-trabalhos.php
│   └── contratacoes/
│       └── criar.php
├── uploads/
│   ├── perfis/
│   └── trabalhos/
├── pages/
│   ├── lobby.html
│   ├── cadastro-profissional.html
│   └── perfil-profissional.html
└── src/
    └── javascript/
        ├── script.js
        └── perfil-profissional.js
```

---

## 🔐 Segurança

1. **Validação de Dados**: Sempre validar no backend
2. **Sanitização**: Limpar inputs para prevenir SQL Injection
3. **Autenticação**: Implementar sistema de login
4. **Upload de Arquivos**: Validar tipo e tamanho
5. **HTTPS**: Usar conexão segura em produção

---

## 📝 Resumo do Fluxo

1. **Profissional se cadastra** → Dados salvos no banco
2. **Profissional faz upload de trabalhos** → Fotos/vídeos salvos
3. **Cliente acessa lobby** → API busca profissionais do banco
4. **Cliente filtra por cidade** → API filtra resultados
5. **Cliente clica em "Contratar"** → Modal abre com dados do profissional
6. **Cliente preenche formulário** → Contratação salva no banco
7. **Profissional recebe notificação** → Pode aceitar/recusar

---

Este documento fornece a base completa para integração. Adapte conforme sua stack tecnológica (Node.js, Python, etc.).

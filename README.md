# Rastreador Correios Web Scraper

Um scraper web automatizado para rastreamento de encomendas dos Correios com detecção automática de CAPTCHA usando Google Cloud Vision AI.

> ⚠️ **ATENÇÃO**: Este é um projeto para fins educacionais. O desenvolvedor não se responsabiliza pelo uso inadequado. Leia o [Disclaimer](#️-disclaimer-e-responsabilidades) antes de usar.

## Funcionalidades

- ✅ Navegação automatizada no site dos Correios
- 🤖 Detecção automática de texto em CAPTCHA usando Google Cloud Vision AI
- 📸 Captura de screenshots do CAPTCHA e resultados
- 🔄 Fallback manual caso a detecção automática falhe
- 📦 Rastreamento completo de encomendas
- 🏗️ Arquitetura modular seguindo o princípio da responsabilidade única

## Estrutura do Projeto

```
src/
├── index.js                    # Arquivo principal de entrada
├── services/
│   ├── trackingService.js      # Serviço principal de rastreamento
│   ├── browserService.js       # Gerenciamento do navegador/Puppeteer
│   └── visionService.js        # Integração com Google Cloud Vision AI
└── utils/
    └── userInput.js            # Utilitários para entrada do usuário
```

### Responsabilidades dos Módulos

- **TrackingService**: Orquestra todo o processo de rastreamento
- **BrowserService**: Gerencia operações do navegador (Puppeteer)
- **VisionService**: Detecta texto em imagens usando Google Cloud Vision AI
- **UserInput**: Utilitários para interação com o usuário no terminal

## Pré-requisitos

1. **Node.js** (versão 14 ou superior)
2. **Conta no Google Cloud Platform** com Vision AI habilitado
3. **Arquivo de credenciais do Google Cloud**

## Configuração do Google Cloud Vision AI

### 1. Criar um projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Habilite a **Vision AI API**

### 2. Criar credenciais de service account

1. Vá para **IAM & Admin > Service Accounts**
2. Clique em **Create Service Account**
3. Preencha os dados e clique em **Create**
4. Adicione a role **Cloud Vision AI Service Agent**
5. Clique em **Done**

### 3. Gerar chave JSON

1. Na lista de service accounts, clique nos três pontos da conta criada
2. Selecione **Manage keys**
3. Clique em **Add Key > Create new key**
4. Escolha **JSON** e clique em **Create**
5. Salve o arquivo JSON em um local seguro

### 4. Configurar variável de ambiente

Defina a variável de ambiente apontando para o arquivo de credenciais:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="caminho/para/seu/arquivo-de-credenciais.json"
```

Para tornar permanente no macOS/Linux, adicione no seu `.bashrc` ou `.zshrc`:

```bash
echo 'export GOOGLE_APPLICATION_CREDENTIALS="caminho/para/seu/arquivo-de-credenciais.json"' >> ~/.zshrc
source ~/.zshrc
```

## Instalação

1. Clone ou baixe o projeto
2. Instale as dependências:

```bash
npm install
```

## Uso

Execute o scraper:

```bash
npm start
```

O programa irá:

1. 🌐 Abrir o site dos Correios
2. 📸 Capturar a imagem do CAPTCHA
3. 🔍 Detectar automaticamente o texto do CAPTCHA (Google Cloud Vision AI)
4. ❓ Solicitar o código de rastreio
5. 🚀 Enviar o formulário automaticamente
6. 📋 Capturar o resultado do rastreamento

## Estrutura do Projeto

```
├── src/
│   └── index.js          # Código principal do scraper
├── package.json          # Dependências e scripts
├── README.md            # Este arquivo
├── captcha_image.png    # Imagem do CAPTCHA (gerada automaticamente)
└── resultado_rastreamento.png # Screenshot do resultado (gerado automaticamente)
```

## Troubleshooting

### Erro de credenciais do Google Cloud

```
❌ Erro ao detectar texto na imagem: Could not load the default credentials
```

**Solução**: Verifique se a variável `GOOGLE_APPLICATION_CREDENTIALS` está configurada corretamente.

### Texto do CAPTCHA não detectado

Se a detecção automática falhar, o programa irá solicitar que você digite o texto manualmente.

### Elemento não encontrado

Se algum elemento da página não for encontrado, o programa irá tirar um screenshot da tela inteira para análise.

## Dependências

- `puppeteer`: Controle automatizado do navegador
- `@google-cloud/vision`: Google Cloud Vision AI para detecção de texto
- `readline`: Interface para input do usuário

## ⚠️ Disclaimer e Responsabilidades

**IMPORTANTE**: Este projeto foi desenvolvido para fins experimentação tecnológica. Ao utilizar este código, você concorda com os seguintes termos:

### Uso e Responsabilidade

- 🧪 **Projeto Experimental**: Desenvolvido para estudo e experimentação de tecnologias web scraping
- ⚠️ **Uso por Sua Conta e Risco**: O desenvolvedor não se responsabiliza por qualquer uso inadequado ou consequências do uso deste código

### Considerações Legais

- 🤖 **Web Scraping Ético**: Use com responsabilidade, evitando sobrecarregar os servidores
- 📞 **Rate Limiting**: Implemente delays adequados entre requisições para não impactar o serviço
- 🔒 **Dados Pessoais**: Respeite a LGPD e outras legislações de proteção de dados

### Recomendações

- Use apenas para rastreamento de suas próprias encomendas ou com autorização
- Implemente mecanismos de cache para evitar requisições desnecessárias
- Considere usar APIs oficiais quando disponíveis
- Monitore mudanças no site que possam afetar o funcionamento

**O uso deste código implica na aceitação total destes termos e na isenção de responsabilidade do desenvolvedor.**

## Licença

ISC

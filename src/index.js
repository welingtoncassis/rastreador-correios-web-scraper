// Importa as bibliotecas necessárias.
// Puppeteer para controlar o navegador e 'readline' para receber input do usuário no terminal.
const puppeteer = require('puppeteer');
const readline = require('readline');

/**
 * Cria uma interface para fazer perguntas ao usuário no terminal.
 * @param {string} query A pergunta a ser exibida para o usuário.
 * @returns {Promise<string>} Uma promessa que resolve com a resposta do usuário.
 */
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

/**
 * Função principal que executa o scraping.
 */
async function rastrearEncomenda() {
  let browser;
  let page; // Define a 'page' no escopo mais alto para ser acessível no 'finally'
  try {
    console.log('Iniciando o navegador...');
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
    const url = 'https://rastreamento.correios.com.br/app/index.php';

    console.log(`Navegando para ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // --- Etapa 1: Capturar apenas a imagem do CAPTCHA ---
    console.log('Tirando print apenas da imagem do CAPTCHA...');
    const captchaElement = await page.$('#captcha_image');
    if (captchaElement) {
      await captchaElement.screenshot({ path: 'captcha_image.png' });
      console.log('✅ Imagem do CAPTCHA salva como "captcha_image.png".');
    } else {
      console.log(
        '⚠️  Elemento do CAPTCHA não encontrado, tirando print da tela inteira...'
      );
      await page.screenshot({ path: 'tela_captcha.png' });
      console.log('✅ Imagem da tela salva como "tela_captcha.png".');
    }
    console.log(
      'Por favor, abra o arquivo e verifique o texto da imagem do CAPTCHA.'
    );

    // --- Etapa 2: Obter dados do usuário ---
    const trackingCode = await askQuestion('➡️  Digite o código de rastreio: ');
    const captchaText = await askQuestion(
      '➡️  Digite o texto que você vê na imagem do CAPTCHA: '
    );

    if (!trackingCode || !captchaText) {
      console.log(
        'Código de rastreio e texto do CAPTCHA são obrigatórios. Abortando.'
      );
      await browser.close();
      return;
    }

    // --- Etapa 3: Preencher o formulário e enviar ---
    console.log('Preenchendo o formulário com os dados informados...');
    await page.type('#objeto', trackingCode);
    await page.type('#captcha', captchaText);

    console.log('Clicando no botão de consulta...');
    await page.click('#b-pesquisar');

    // --- Etapa 4: Capturar apenas o resultado do rastreamento ---
    console.log('Aguardando o resultado do rastreamento...');

    await page.waitForSelector('#tabs-rastreamento .ship-steps', {
      timeout: 10000,
    });

    console.log('Tirando print apenas da área de rastreamento...');
    const rastreamentoElement = await page.$('#tabs-rastreamento');
    if (rastreamentoElement) {
      await rastreamentoElement.screenshot({
        path: 'resultado_rastreamento.png',
      });
      console.log(
        '✅ Resultado do rastreamento salvo como "resultado_rastreamento.png".'
      );
    } else {
      console.log(
        '⚠️  Elemento de rastreamento não encontrado, tirando print da tela inteira...'
      );
      await page.screenshot({ path: 'tela_de_rastreio.png' });
      console.log(
        '✅ Um print da tela foi salvo como "tela_de_rastreio.png" para análise.'
      );
    }
  } catch (error) {
    if (error instanceof puppeteer.TimeoutError) {
      console.error(
        '❌ A página demorou muito para responder ou nenhum resultado/erro conhecido foi encontrado.'
      );
    } else {
      console.error('Ocorreu um erro inesperado durante o processo:', error);
    }

    if (page) {
      await page.screenshot({ path: 'tela_de_erro.png' });
      console.log(
        '✅ Um print da tela foi salvo como "tela_de_erro.png" para análise.'
      );
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log('Navegador fechado.');
    }
  }
}

// Executa a função principal.
rastrearEncomenda();

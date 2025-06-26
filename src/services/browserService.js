const puppeteer = require('puppeteer');

/**
 * Classe responsável por operações com Puppeteer/Browser
 */
class BrowserService {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * Inicializa o navegador
   */
  async initBrowser() {
    console.log('Iniciando o navegador...');
    this.browser = await puppeteer.launch({
      headless: process.env.PUPPETEER_HEADLESS === 'true' || true,
    });
    this.page = await this.browser.newPage();
  }

  /**
   * Navega para uma URL
   * @param {string} url URL de destino
   */
  async navigateToUrl(url) {
    console.log(`Navegando para ${url}...`);
    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  /**
   * Captura screenshot do elemento CAPTCHA
   * @returns {Promise<string>} Caminho da imagem capturada
   */
  async captureCaptchaImage() {
    console.log('Tirando print apenas da imagem do CAPTCHA...');
    const captchaElement = await this.page.$('#captcha_image');
    let captchaImagePath = '';

    if (captchaElement) {
      captchaImagePath = 'captcha_image.png';
      await captchaElement.screenshot({ path: captchaImagePath });
      console.log('✅ Imagem do CAPTCHA salva como "captcha_image.png".');
    } else {
      console.log(
        '⚠️  Elemento do CAPTCHA não encontrado, tirando print da tela inteira...'
      );
      captchaImagePath = 'tela_captcha.png';
      await this.page.screenshot({ path: captchaImagePath });
      console.log('✅ Imagem da tela salva como "tela_captcha.png".');
    }

    return captchaImagePath;
  }

  /**
   * Preenche o formulário de rastreamento
   * @param {string} trackingCode Código de rastreamento
   * @param {string} captchaText Texto do CAPTCHA
   */
  async fillTrackingForm(trackingCode, captchaText) {
    console.log('Preenchendo o formulário com os dados informados...');
    console.log(`📦 Código de rastreio: ${trackingCode}`);
    console.log(`🔤 Texto do CAPTCHA: ${captchaText}`);

    await this.page.type('#objeto', trackingCode);
    await this.page.type('#captcha', captchaText);

    console.log('Clicando no botão de consulta...');
    await this.page.click('#b-pesquisar');
  }

  /**
   * Aguarda e captura o resultado do rastreamento
   */
  async captureTrackingResult() {
    console.log('Aguardando o resultado do rastreamento...');

    await this.page.waitForSelector('#tabs-rastreamento .ship-steps', {
      timeout: 10000,
    });

    console.log('Tirando print apenas da área de rastreamento...');
    const rastreamentoElement = await this.page.$('#tabs-rastreamento');
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
      await this.page.screenshot({ path: 'tela_de_rastreio.png' });
      console.log(
        '✅ Um print da tela foi salvo como "tela_de_rastreio.png" para análise.'
      );
    }
  }

  /**
   * Captura screenshot em caso de erro
   */
  async captureErrorScreenshot() {
    if (this.page) {
      await this.page.screenshot({ path: 'tela_de_erro.png' });
      console.log(
        '✅ Um print da tela foi salvo como "tela_de_erro.png" para análise.'
      );
    }
  }

  /**
   * Fecha o navegador
   */
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      console.log('Navegador fechado.');
    }
  }
}

module.exports = BrowserService;

const puppeteer = require('puppeteer');
const BrowserService = require('./services/browserService');
const { detectTextInImage } = require('./services/visionService');
const { askQuestion } = require('./utils/userInput');

/**
 * Classe principal responsável pelo processo de rastreamento
 */
class TrackingService {
  constructor() {
    this.browserService = new BrowserService();
  }

  /**
   * Executa o processo completo de rastreamento
   */
  async executeTracking() {
    try {
      await this.browserService.initBrowser();

      const url =
        process.env.CORREIOS_URL ||
        'https://rastreamento.correios.com.br/app/index.php';

      await this.browserService.navigateToUrl(url);

      const captchaImagePath = await this.browserService.captureCaptchaImage();

      let captchaText = '';
      if (captchaImagePath) {
        captchaText = await detectTextInImage(captchaImagePath);
      }

      if (!captchaText) {
        console.log('⚠️  Não foi possível detectar o texto automaticamente.');
        console.log(
          'Por favor, abra o arquivo de imagem e verifique o texto do CAPTCHA.'
        );
        captchaText = await askQuestion(
          '➡️  Digite o texto que você vê na imagem do CAPTCHA: '
        );
      }

      const trackingCode = await askQuestion(
        '➡️  Digite o código de rastreio: '
      );

      if (!trackingCode || !captchaText) {
        console.log(
          'Código de rastreio e texto do CAPTCHA são obrigatórios. Abortando.'
        );
        return;
      }

      await this.browserService.fillTrackingForm(trackingCode, captchaText);

      await this.browserService.captureTrackingResult();
    } catch (error) {
      await this.handleError(error);
    } finally {
      await this.browserService.closeBrowser();
    }
  }

  /**
   * Trata erros durante o processo de rastreamento
   * @param {Error} error Erro ocorrido
   */
  async handleError(error) {
    if (error instanceof puppeteer.TimeoutError) {
      console.error(
        '❌ A página demorou muito para responder ou nenhum resultado/erro conhecido foi encontrado.'
      );
    } else {
      console.error('Ocorreu um erro inesperado durante o processo:', error);
    }

    await this.browserService.captureErrorScreenshot();
  }
}

module.exports = TrackingService;

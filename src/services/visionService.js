const vision = require('@google-cloud/vision');

/**
 * Detecta texto em uma imagem usando Google Cloud Vision AI.
 * @param {string} imagePath Caminho para a imagem.
 * @returns {Promise<string>} O texto detectado na imagem.
 */
async function detectTextInImage(imagePath) {
  try {
    console.log(
      '🔍 Detectando texto na imagem do CAPTCHA usando Google Cloud Vision AI...'
    );

    const client = new vision.ImageAnnotatorClient();

    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    if (detections && detections.length > 0) {
      const detectedText = detections[0].description.trim();
      console.log(`✅ Texto detectado no CAPTCHA: "${detectedText}"`);
      return detectedText;
    } else {
      console.log('⚠️  Nenhum texto foi detectado na imagem do CAPTCHA.');
      return '';
    }
  } catch (error) {
    console.error('❌ Erro ao detectar texto na imagem:', error.message);
    console.log(
      '💡 Certifique-se de que suas credenciais do Google Cloud estão configuradas corretamente.'
    );
    console.log(
      '💡 Verifique se a variável GOOGLE_APPLICATION_CREDENTIALS está definida no arquivo .env'
    );
    console.log(
      `💡 Caminho atual das credenciais: ${
        process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Não definido'
      }`
    );
    return '';
  }
}

module.exports = {
  detectTextInImage,
};

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

module.exports = {
  askQuestion,
};

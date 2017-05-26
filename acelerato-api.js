var request = require('sync-request');
var Mattermost = require('node-mattermost');

var channel = 'hackathon';
var icon_url = 'http://brejo.com/wp-content/uploads/2013/07/mestre-dos-magos.jpg';
var username = 'Mestre dos Magos';

var mattermost = new Mattermost('http://localhost:8065/hooks/xhaabk57pfrftfp9363kh1nk9c');

var TAMANHO_MAXIMO = 400;
var urlAcelerato = 'http://192.168.253.228:8080';

var frasesMestreDosMagos = ['Lukian mora no mais triste das prisões: a prisão sem muro', 'Quando as coisas parecerem piores é porque estão melhores', 'Irão reconhecer Lukian quando ele se comunicar sem palavras',
'Saudações, jovens pupilos', 'O destino de um é partilhado por todos.', 'Nas trevas, olhem para a luz.', 'Através do erro vocês conseguirão a vitória.', 'Não é importante a rapidez com que se aprende, mas que se aprenda',
'Uma pequena boa ação pode levar a uma grande recompensa.', 'Todas as coisas são possíveis para os que têm o coração livre da maldade.', 'Não acho que quem ganhar ou quem perder, nem quem ganhar nem perder, vai ganhar ou perder. Vai todo mundo perder.',
'Eu vi. Você, veja. Eu já vi, parei de ver. Voltei a ver e acho que Neymar e o Ganso têm essa capacidade de fazer a gente olhar.'];

var options = {
  host: urlAcelerato,
  endpoint: '/api/base-de-conhecimento/busca/tags?tag=',
  httpVerb: 'GET'
};

function sendRequest(texto) {
  var res = request(options.httpVerb, options.host + options.endpoint + texto);
  return new Buffer(res.getBody(), 'hex').toString('utf8');
}

mattermost.send({
  text: 'Bem-vindo ao centro de perguntas e respostas do Mestre dos Magos. Está carente? Converse comigo! Digite help para começar!',
  channel: channel,
  username: username,
  icon_url: icon_url
});

module.exports = {
  busca: function(req, res) {
    var reply = mattermost.respond(req.body, function(hook) {

      var respostas = JSON.parse(sendRequest(hook.text.replace(/ /g, ',')));

      var texto = '# Encontrei os seguintes conteúdos relacionados a sua pergunta: \n';
      if (!respostas.length) {
        return {
          text: 'Infelizmente, não encontrei nada relacionado a sua busca. Por favor, tente utilizar palavras chave. Ex: **git**,  **spring**, **mvc**, **docker**, **bhaskhara**, etc. Por hora, fique com a palavra do mestre: \n # ' + frasesMestreDosMagos[Math.floor(Math.random() * frasesMestreDosMagos.length)],
          username: username,
          icon_url: icon_url  
        }
      }

      var conteudo = '';
      conteudo = texto;
        
        respostas.forEach(resposta => {          
            if (resposta.conteudo.length > TAMANHO_MAXIMO){
              conteudo += '- ' + resposta.conteudo.substring(0, TAMANHO_MAXIMO).concat(' **Ler mais em: **' + urlAcelerato +'/base-de-conhecimento/#/artigos/' + resposta.id +  ' \n');
            }  else {
              conteudo += '- ' + resposta.conteudo + ' \n';
            }
 
        });
      return {
        text: conteudo,
        username: username,
        icon_url: icon_url
      }
    });

    res.json(reply);
  }
};
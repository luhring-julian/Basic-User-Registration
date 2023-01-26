/**
 * Arquivo de configuração para inicialização da aplicação
 */

//Importação de pacotes/módulos para uso da aplicação
var express = require("express"); //Importação do pacote Express
var app = express(); //Inicialização da aplicação 'app' pelo pacote Express
var bodyParser = require("body-parser"); //Importação do pacote body-parser

/**
 * Configuração da aplicação para utilizar o pacote body-parser para retornar os dados da requisição.
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Importação do pacote cors
const cors = require("cors");

//Importação do pacote Mongoose
var mongoose = require("mongoose");

//Configuração da conexão com o MongoDB no serviço cloud MongoDB Atlas
const uri =
  "mongodb+srv://julian:julian1991@cluster0.a1r3dgl.mongodb.net/?retryWrites=true&w=majority";

//Validação da configuração da conexão com o MongoDB
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("A conexão com o MongoDB foi realizada com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

//Importação do esquema Usuário
var Usuario = require("./modelo/usuario");

//Definição da porta do servidor da aplicação
var porta = 8080;

//Definição da variável router para utilizar as instâncias das rotas do pacote express
var router = express.Router();

//Configuração do pacote cors para autorizar requisições de todas as origens
app.use(cors());

//Definição do middleware para acessar as solicitações enviadas à API
router.use(function (req, res, next) {
  console.log("Acesso à primeira camada do middleware...");
  //Definição do site de origem que tem permissão para realizar a conexão com a API
  //O "*" indica que qualquer site pode fazer a conexão
  res.header("Access-Control-Allow-Origin", "*");
  //Definição dos métodos permitidos pela conexão durante o acesso à API
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  app.use(cors());
  next();
});

//Rota para exibir uma mensagem ao usuário
app.get("/", (req, res) => {
  res.send("Olá mundo! Esta é a página inicial da nossa aplicação.");
});

/**
 * Rota padrão para verificação do funcionamento da aplicação
 * Acesso: GET https://2hcctd-8080.csb.app
 */
router.get("/", function (req, res) {
  res.json({
    message: "Olá mundo! Esta é a nossa API desenvolvida em Node.js",
  });
});

//Rotas terminadas em '/usuarios' (rotas para os verbos GET e POST)
router
  .route("/usuarios")

  /**
   * Método POST: cadastrar um usuário
   * Acesso: POST https://2hcctd-8080.csb.app/usuarios
   */
  .post(function (req, res) {
    var usuario = new Usuario();
    //Definição dos campso que fazem parte da solicitação
    usuario.nome = req.body.nome;
    usuario.login = req.body.login;
    usuario.senha = req.body.senha;

    usuario.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Usuário cadastrado com sucesso!" });
    });
  })

  /**
   * Método GET: retornar a listagem de todos os usuários
   * Acesso: GET https://2hcctd-8080.csb.app/usuarios
   */
  .get(function (req, res) {
    Usuario.find(function (error, usuarios) {
      if (error) res.send(error);
      res.json(usuarios);
    });
  });

//Rotas terminadas em '/usuarios/:usuario_id' (rotas para os verbos GET, PUT e DELETE)
router
  .route("/usuarios/:usuario_id")

  /**
   * Metodo GET: listar as informações de um usuário específico
   * Acesso: GET https://2hcctd-8080.csb.app/api/usuarios/:usuario_id
   */
  .get(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      res.json(usuario);
    });
  })

  /**
   * Método PUT: atualizar as informações de um usuário específico
   * Acesso: PUT https://6j07g.sse.codesandbox.io/api/usuarios/:usuario_id
   */

  .put(function (req, res) {
    Usuario.findById(req.params.usuario_id, function (error, usuario) {
      if (error) res.send(error);
      //A solicitação envia os dados para serem validados pelo esquema 'usuario'
      usuario.nome = req.body.nome;
      usuario.login = req.body.login;
      usuario.senha = req.body.senha;
      usuario.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário atualizado com sucesso!" });
      });
    });
  })

  /**
   * Método DELETE: deletar um usuário específico
   * Acesso: DELETE https://6j07g.sse.codesandbox.io/api/usuarios/:usuario_id
   */
  .delete(function (req, res) {
    Usuario.deleteOne(
      {
        _id: req.params.usuario_id,
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário excluído com sucesso!" });
      }
    );
  });

//Inicialização do servidor da aplicação
app.listen(porta);
console.log("Iniciando a aplicação na porta " + porta);

//Definição de uma rota com prefixo '/api' para todas as rotas
app.use("/api", router);

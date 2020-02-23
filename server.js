// 1 - configurando o servidor
const express = require('express')
const server = express()

// 5 - configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// 7 - habilitar body do formulario
server.use(express.urlencoded({ extended: true }))

// 8 - configurar conexao com banco de dados
const Pool = require('pg').Pool // .Pool mantem a conexao ativa
const db = new Pool({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})

// 4 - configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
  express: server,
  noCache: true,
})

// 3 - configurando apresentacao da pagina
server.get('/', function(req, res) {
  // Peguei o res(resposta) e enviei com o send(enviar)
  
  // 10 - Final
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados.")

    const donors = result.rows
    return res.render('index.html', { donors })
  })
})  

server.post('/', function(req, res) {
  // 6 - pegar dados do formulario
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  // Se o nome igual a vazio
  // Se o email igual a vazio
  // Se o sangue igual a vazio

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios")
  }

  // 9 - coloco valores dentro do banco de dados
  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, function(err) {
    // fluxo de erro
    if (err) return res.send("Erro no banco de dados.")

    // fluxo ideal
    return res.redirect('/')
  })

})

// 2 - Servidor
server.listen(3000, function() {
  console.log('Iniciei o servidor...')
}) // Porta do servidor localhost:3000

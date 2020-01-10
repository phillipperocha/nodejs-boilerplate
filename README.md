## Libraries

### 1. Express JS - Framework

O Express é um framework para aplicativo da web do Node.js mínimo e flexível que fornece um conjunto robusto de recursos para aplicativos web e móvel. 

#### 1.1 Instalação

```
yarn add express
```

#### 1.2 Documentação

https://expressjs.com/pt-br/

### 2. Sucrase (ECMAScript atualizado) & Nodemon (Hot Reload)

Existem algumas funcionalidades do JavaScript que o **node ainda não suporta**, coisas mais recentes da linguagem. Uma delas é utilizar **import** e **export** para fazer a importação de módulos dentro da aplicação. Por exemplo nas novas versões do JavaScript que nós **já utilizamos no front end com React ou React Native**, pra importarmos o express podíamos simplesmente declarar.

```javascript
// Nova
import express from 'express'

// No lugar de require (sintaxe antiga do Common JS)

// const express = require('express')
```

Para fazer isso temos várias formas, podemos utilizar **Babel**, **Babel Node**, mas particularmente prefiro o **Sucrase** que é extremamente rápido e faz isso de uma forma muito bacana.

O que faremos agora é utilizar tanto o **Sucrase** quanto o **Nodemon** como dependência do projeto para rodar apenas em modo de desenvolvimento.

```shell
yarn add sucrase nodemon -D
```

E após instalado **agora podemos usar as novidades do JavaScript.**

Em **Todos os arquivos** vamos alterar o **require** para **import**:

Exemplo em **app.js**:

```
import express from 'express'
import routes from './routes'
```

E agora no **Export**, por ex **app.js**, ao invés de *module.exports* podemos utilizar *export default*: (Lembre de também trocar no routes.js)

```
export default new App().server;
```

**Bem, e agora?** Se rodarmos o **Node** vemos que ele dará um erro, **porque ele não reconhece esse import**.

Para isso podemos rodar agora o servidor utilizando o **Sucrase**.

```
yarn sucrase-node src/server.js
```

Mas e o **Nodemon** para o **hot reload**? No **package.json** vamos criar o nosso novo script para subir a aplicação.

```javascript
{
  "name": "barberShop",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^1.19.4",
    "sucrase": "^3.10.1"
  }
}
```

Porém se rodarmos dessa forma,ele não vai rodar utilizando o **Sucrase**. Para isso **criaremos um arquivo \*nodemon.json\* de configuração do Nodemon na pasta raíz**.

Criaremos um objeto e dentro dele a propriedade **execMap**, essa propriedade fala que para qual extensão de arquivo, no nosso caso **js**, ou seja, quando executarmos o nodemon em um arquivo **.js**, que ao invés do node ele utilize o **sucrase-node**.

```
{
    "execMap": {
        "js": "sucrase-node"
    }
}
```

### 3. ESLint, Prettier & EditorConfig (Padrões de código)

O que faremos agora é configurar duas ferramentas que vão nos ajudar na hora de padronizar o código, ou seja, manter o mesmo padrão de escrita de código entre os mesmos desenvolvedor do nosso time.

Por exemplo, no JS a gente pode, ou não, utilizar ponto e vírgula no fim da linha, podemos usar vírgula no fim de um array ou não, podemos utilizar tab ou espaços no vs code pra identar o nosso código ou até usar UTF-8 ou não para fazer o encoding, ou seja, tem várias e várias formas de escrever o nosso código.

Existem várias ferramentas que vão nos ajudar a padronizar o nosso código. Existem padrões já definidos pela própria comunidade e eu gosto muito de utilizar o padrão da **AirBnb**.

#### ESLint

Como vamos começar a configurar o padrão de código? No terminal vamos:

```shell
# Vai fazer o linting do nosso código, ou seja, verificar se o código está seguindo o nosso padrão.
yarn add eslint -d

# E agora vamos iniciar um arquivo de configuração
yarn eslint --init

# Vamos marcar a última opção que é para:
# 1- Checar sintaxe, encontrar problemas e forçar estilo de código
# 2- Import e export
# 3- Nenhum (nem react nem vue)
# 4 - Não utilizaremos TypeScript
# 5 - Estamos usando apenas no Node, então utilizando barra de espaço desseleciona o browser e seleciona o Node
# 6 - Qual o styleguide, vamos usar uma popular
# 7 - AirBnb
# 8 - Em formato de javascript comum
# 9 - Instalar as dependencias do airbnb? Sim!

# O que acontece aí 
```

O que acontece aí no fim é que ele instalou tudo utilizando o NPM, e assim é criado um novo arquivo chamado **package-lock.json** e eu não quero isso. E vamos remover esse arquivo e mapear tudo pelo yarn com o comando

```shell
yarn
```

Por fim vamos instalar no VS Code a extensão **ESLint**, para conseguir começar a formatar o código. Se abrirmos qualquer arquivo vamos perceber que ele está dando uns errozinhos embaixo.

Se olharmos o nosso código agora veremos que está cheio de sugestões.

Ele sugere o breakline como LF, 2 spaces de espaçamento, etc.

Mas é possível também a formatação automática, o ESLint permite que dentro do vs code, em configurações podemos ir em setting no json:

```json
	// Vai corrigir quando salvarmos com as configurações do ESLint
    "eslint.autoFixOnSave": true,
	"eslint.validate": [
        {
            "language": "javascript",
            "autoFix": true
        },
        {
            "language": "javascriptreact",
            "autoFix": true
        },
        {
            "language": "typescript",
            "autoFix": true
        },
        {
            "language": "typescriptreact",
            "autoFix": true
        },
    ],
```

Por último vamos sobrescrever algumas regras do ESLINT em **.eslintrc.js**:

```javascript
  rules: {
  	// Existe uma regra padrão do ESLint que todo método de uma classe precisa utilizar o THIS, e o nosso controller e o nosso APP precisa estar dentro de uma classe e não precisa usar isso
    "class-methods-use-this": "off",
    // Permite que recebamos um parâmetro e faça alterações do parâmetro, precisamos disso devido o sequelize pra manipular alguns dados.
    "no-param-reassign": "off",
    // Vao ter casos que iremos precisar de variáveis com snake case, explicaremos no futuro.
    "camelcase": "off",
    
   // existe uma regra padrão no ESLint que não posso declarar variáveis sem utilizar
   // e existe uma variável dentro do express chamada next, que pode ser declarada sem precisar de uso, para ela essa regra não vai valer.
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
```

Podemos voltar agora pro nosso **app.js**, e ver que está tudo em ordem.

#### Prettier

Agora vamos configurar o Prettier. É uma ferramenta que deixa nosso código mais bonito. E é diferente do ESLint. O ESLint não faz uma checagem se a nossa linha de código fica muito grande, o Preettier já faz.

```shell
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Agora vamos no **.eslintrc.js** e em

```javascript
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
};
```

Se formos no arquivo **app.js** e se salvarmos vamos poder perceber que ele fez algumas alterações que eu nem queria, como aspas duplas ao redor da String. Mas o styleguide do AirBnb ele diz que usemos aspas simples. Isso acontece porque o prettier, e o airbnb estão as vezes com regras duplicadas definidas em ambos. Para isso criaremos um arquivo chamado **.prettierrc** e sobrescreveremos as regras que não estamos de acordo.

```json
{
    "singleQuote": true,
    "trailingComma": "es5"
}
```

Por fim, se quisermos ao invés de acessar arquivo por arquivo e aplicar as regras do ESLINT podemos usar:

```shell
// Ele vai fixar todos os arquivos que tem extensao .js
yarn eslint --fix src --ext .js
```

#### EditorConfig

Pra finalizar o leque de ferramentas que vão garantir a padronização do código vamos instalar uma última ferramenta/extensão do VS Code e essa ferramenta vai servir muito mais caso nossa equipe tenha desenvolvedores que utilizam editores diferentes.

Vamos instalar um plugin chamado **EditorConfig** no VS Code, após instalado vamos no nosso projeto, clicar com o botão direito na raíz e ir em **Generate .editorconfig**.

Devemos nos certificar que fique da seguinte maneira:

```python
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

Por isso é bom garantir que todos os desenvolvedores estejam utilizando tudo da mesma forma.

### 4. Dotenv (Configurando variáveis de ambiente)



### 5. sequelize & sequelize-cli

**Sequelize é um ORM para NodeJS** para Bancos de Dados Relacionais, ou seja funciona com MySql, Postgres, etc.

ORM serve para que possamos abstrair o banco de dados.

**Tabelas** viram **Models**.

Como manipularemos os dados dentro da nossa base de dados? Não vamos utilizar SQL, apenas código JavaScript.

Por exemplo, onde em **SQL** inserímos um usuário:

```sql
INSERT INTO users (name, email)
	VALUES (
    	"Phillippe Rocha",
        "phillipperocha@gmail.com"
    )
```

Utilizando o **Sequelize** seria da seguinte forma:

```javascript
User.create({
	name: 'Phillippe',
	email: 'phillipperocha@gmail.com'
})
```

Esse User nesse caso é o nosso Model de Usuário, vamos importar esse User do arquivo **User,js** que criaremos e daí poderemos utilizar esse método.

Outro exemplo para buscar um usuário:

```sql
SELECT *
FROM users
WHERE email = "phillipperocha@gmail.com"
LIMIT 1
```

Ficaria:

```javascript
User.findOne({
	where: {
		email: "phillipperocha@gmail.com"
	}
})
```

E temos uma sintaxe bem mais bacana e funciona com vários bancos de dados diferentes.

Com a utilização do **Sequelize** na aplicação, ganhamos uma funcionalidade nova de **Migrations**. Ela é um controle de versão para base de dados, é uma forma de manter a base atualizada entre todos os desenvolvedores e também entre desenvolvimento e produção.

- Cada arquivo de migração contém instruções para criação, alteração ou remoção de tabelas ou colunas do banco de dados.
- Mantém a base atualizada entre todos os desenvolvedores do timee também no ambiente de produção.
- Cada arquivo é uma migration e sua ordenação ocorre por data.

##### Uma migration **NUNCA** pode se relacionar com uma tabela que é criada por uma migration posterior, ou seja, se eu tô criando uma migration agora, a tabela de agora não pode depender de uma migration que só vai acontecer no futuro. Todas as migrations são feitas por data.

Exemplo de arquivo migration:

![explaining-migrations](F:\Google Drive\Dev\JavaScript\explaining-migrations.png)

Outra coisa a ser dita, quando a migration sai do nosso computador e vai para outros usuários ou para outro ambiente a gente **NUNCA PODE EDITAR UMA MIGRATION.** Se precisarmos adicionar um campo ou editar ou deletar, criaria uma nova migration alterando ou deletando o que for.

Alguns conceitos:

- É possível desfazer uma migração se errarmos algo enquanto estivermos desenvolvendo a feature. Nesse caso, basta dar um rollback, desfaço a migração que executamos, faço as alterações necessárias e roda a migration novamente.
- Depois que a migration foi enviada para outros devs ou para produção, JAMAIS poderá ser alterada.
- Cada migration deve realizar alterações em APENAS UMA TABELA, você pode criar várias migrations para alterações maiores.

#### 5.1 Seeds

Agora um conceito muito bacana quando você precisa configurar um ambiente de testes de sua aplicação. Vamos supor que um novo desenvolvedor entra no seu time e instala o software pra ele começar a desenvolver na máquina dele é muito legal se o seu software já vier com alguns dados fictícios, como usuário, administrador, produtos, compras, etc. Para isso podemos utilizar os Seeds.

- São arquivos que populam a base de dados para desenvolvimento, criando usuários, produtos fake.
- Muito utilizado para popular dados para testes.
- Executável apenas por código. (Não conseguimos executar pelo DB, precisam de comando na linha de comando)
- Jamais será utilizado em produção.
- Caso sejam dados que precisam ir para produção, a própria migratoin pode manipular dados das tabelas.

Por exemplo, eu tenho uma tabela chamada *Status do Pedido*, e eu sei que os status são 1, 2, 3 ou 4, Pendente, Aprovado, Completo e Enviado, são status que dificilmente vão mudar e quero que eles já estejam na tabela. Vamos utilizar as migrations em vez dos Seeds.

#### 5.2 Instalação

```shell
yarn add sequelize
# esse sequelize cdi é uma interface de linha de comando pra facilitar a criação de migrations, executá-las, criar models, etc.
yarn add sequelize-cli -D
```

#### 5.3 Link da documentação:

https://sequelize.org

##### PS! Para utilizar o *dotenv* com *sequelize*-cli em **database.js** para realizar migrations faz-se necessário importar da forma abaixo:

```javascript
// import!
require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  define: {
    // To guarantee that we will have CreateAt and UpdateAt columns
    timestamps: true,
    // Setup to use underscores in our tables
    underscored: true,
    underscoredAll: true,
  },
};

```

## 6. BcryptJS

para resolver este problema das chaves que são usados os algoritmos de hashing criptográfico, como por exemplo, o crypt. Com estes algoritmos, uma vez que a informação é criptografada, não é mais possível reverter a situação e recuperar os dados. E para poder validar os dados, no caso de login, é só calcular o hash da senha fornecida pelo usuário e comparar com o hash do banco de dados. Bem simples.

Porém, com a constante evolução da tecnologia, é possível criar algoritmos eficientes com o intuito de quebrar hashes por força bruta, e foi por isso que surgiu em 1999, o Bcrypt.

O Bcrypt oferece uma maior segurança do que os outros algoritmos criptográficos porque contém uma variável que é proporcional à quantidade de processamento necessário para criptografar a informação desejada, tornando-o resistente a ataques do tipo “força-bruta”.

#### 6.1 Instalação

```shell
yarn add bcryptjs
```

#### 6.2 Documentação

https://www.npmjs.com/package/bcryptjs

### 7. Jsonwebtoken (JWT)

#### 7.1 Instalação

```shell
yarn add jsonwebtoken
```

#### 7.2 Documentação

https://www.npmjs.com/package/jsonwebtoken

### 8. Yup (Validação)

É uma boa prática ter a validação do usuário no frontend no backend, a vantagem de estar no frontend é que a validação é mais rápida, não precisa ir diretamente no servidor para poder verificar se tem algum dado errado ou faltando, ganha em velocidade, também em menos tráfego ao servidor e principalmente na segurança. Ter só a validação no frontend não é uma boa prática, na verdade é uma péssima prática.

Vamos validar o frontend com biblioteca [Yup](https://github.com/jquense/yup), que faz uma validação no schema, Schema Validation:

#### 8.1 Instalação

```shell
yarn add yup
```

#### 8.2 Documentação

https://github.com/jquense/yup

#### 8.3 Exemplo

Para aproveitar o embalo do Usuário, vamos validar seus dados.

```javascript
// import Yup from 'yup'
// Não é possível importar o Yup dessa forma porque ele não tem nenhum expor default
// Por isso precisamos importar todas as funções numa variável Yup
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // Aqui dentro do controller vamos começar com nossas validações
    // Utilizamos o Yup.object() para informar que estamos validando um objeto
    // Já que o nosso req.body é um objeto.
    const schema = Yup.object().shape({
      // E dentro vamos passar o formato que esse schema tem que ter
      // Ele tem que ter um nome
      name: Yup.string().required(),
      // email() ele valida tudo sobre email, se tem arroba, etc.
      email: Yup.string()
        .email()
        .required(),
      // E a senha vai conter o mínimo de 6 dígitos
      password: Yup.string()
        .required()
        .min(6),
    });

    // Agora precisamos ver se o req.body está passando conforme o schema criado
    // o método isValid() é assíncrono, por isso precisamos do await
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User alredy exists.' });
    }
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // Agora faremos de forma similar aqui na edição do usuário com umas regras a mais

    const schema = Yup.object().shape({
      // Como o nome é uma edição, ele não precisa ser obrigatório
      name: Yup.string(),
      // email também
      email: Yup.string().email(),
      // A senha também não. Mas quando ela vier acompanhado a senha antiga (OldPassword)
      // ela será obrigatória, porque quer dizer que ele está querendo alterá-la.
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        // Então, se ele falar o oldPassword, precisa informar o password
        // No when temos acesso a todos os outros campos do Yup
        // O when recebe o campo no primeiro parâmetro e em seguida uma função
        // Na função passamos o proprio campo de primeiro parâmetro e em seguida
        // A continuação da validação
        .when('oldPassword', (oldPassword, field) =>
          // Se o oldPassword existir, o field password vai ser required, caso o contrário não
          // Isso é o retorno da função, por isso passamos o field
          oldPassword ? field.required() : field
        ),
      // Ainda queremos mais, quando o password for informado o usuário tem que enviar
      // ainda um campo confirmPasssword com o mesmo valor para garantir a senha.
      confirmPassword: Yup.string().when('password', (password, field) =>
        // quando for passado o password, o confirmPassword é obrigatório e
        // Precisa assumir um dos valores de dentro do array.
        // O yup tem um método para se referir a outro campo chamado ref
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'USer alredy exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
```

### 9. Multer 

Os usuários que são prestadores de serviço poderão ter um avatar e subir um arquivo de imagem. Primeiro precisaremos tratar de upload de arquivos, e existem várias formas de fazer isso na aplicação.

Primeira forma mais tradicional seria enviar a imagem junto com os outros dados enquanto ele está fazendo o registro dele. Por exemplo quando ele for incluir o nome, senha, email e a imagem do avatar viria numa única requisição no backend e o backend trataria as informações do avatar primeiro (upload de arquivos e tudo mais) e depois salvando tudo de uma vez no banco de dados.

A segunda forma, e a que usaremos (e eu prefiro), é fazer o upload de arquivos isolado. O que aconteceria é que na hora que ele selecionasse a imagem pra incluir no avatar dele, essa imagem já era enviada para o servidor e o upload já é feito e o servidor retorna um ID da imagem. E na hora que formos preencher os dados do cadastro, salvamos apenas o ID da imagem junto dos dados do avatar, assim conseguindo manter a estrutura de **JSON** pra enviar os dados do prestador de serviço e não precisaremos utilizar outra estrutura já que o **JSON NAO SUPORTA ENVIO DE UPLOAD DE ARQUIVOS.**

Precisamos de uma biblioteca que precise lidar com envio de corpo diferente, além do formato JSON que estamos acostumado. **Quando precisamos lidar com arquivo nas requisições, precisamos enviar as requisições num formato *MULTIPART FORM DATA* que é o único formato que suporta o envio de arquivos físicos.

Para isso utilizaremos **Multer**:

#### 9.1 Instalação:

```shell
yarn add multer
```

Assim que instalarmos o multer, criaremos uma pasta na raíz do projeto **tmp/uploads**, e aí ficarão todos os uploads que fizermos.

Agora criaremos **src/config/multer.js**:

```javascript
// Aqui dentro ficará toda a nossa configuração de upload de arquivos
import multer from 'multer';
// Importaremos também uma biblioteca do node chamada crypto
import crypto from 'crypto';
// Também importaremos duas funções do path do node
// extname - que retorna a extensão baseado num nome de arquivo
// resolve - para percorrer um caminho na aplicação
import { extname, resolve } from 'path';

// Aqui exportaremos um objeto de configuração
export default {
  // A primeira chave é o storage: como o multer vai guardar nossos arquivos de imagem
  // aqui podemos utilizar vários storages que o multer tem, por exemplo podemos guardar
  // nossos arquivos de imagem dentro de um CDN - Content Delivery Network
  // São servidores online feitos para armazenamento de arquivos físicos (S3 da Amazon) ou Digital Ocean Space
  // Mas no nosso caso, vamos guardar as imagens dentro dos arquivos da aplicação
  // na pasta temp. Para isso utilizaremos diskStorage
  storage: multer.diskStorage({
    // Aqui estamos voltando a partir do diretório atual de pasta em pasta
    // Até chegar na pasta de uploads
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // cb de callback
    // Aqui é basicamente como vamos formatar o nome de arquivo da nossa imagem
    // Poderiamos deixar com o mesmo nome do arquivo, mas não é recomendado
    // O que faremos é transformar todo nome de imagem num código único
    // (req, a requisição - file: temos acesso ao tipo, tamanho, formato, nome, etc)
    filename: (req, file, cb) => {
      // vamos utilizar o crypto com o randombytes para gerar caracteres aleatórios
      // passamos quantos caracteres são e o segundo formato uma callback
      // para pegar o resultado do crypto.randomBytes()
      // A função recebe um erro (caso tenha) e uma resposta caso tenha dado tudo certo
      crypto.randomBytes(16, (err, res) => {
        // esse cb (callback), é a função que precisamos executar com o nome do arquivo
        // ou com o erro, caso tenha dado algum problema
        if (err) return cb(err);
        // retornaremos o null, pq o callback recebe como primeiro parâmetro o erro
        // e por segundo passaremos o nome da imagem em sí
        // transforaremos 16 bytes aleatórios em uma string hexadecimal
        // e concatenaremos com a extensão do arquivo original

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
```

Agora conseguimos testar as configurações do **multer** indo em nossas **rotas**:

```javascript
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Variable to uploads
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// We are defining auth middleware as Global, below here all routes needs to auth
routes.use(authMiddleware);

routes.put('/users', UserController.update);

// Defining a route without a controller and a middleware to just accept single files
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
});

export default routes;

```

Agora no **Postman**, vamos criar uma requisição **POST**, para **http://localhost:3333/files/ ** e no **Body** no lugar de **none ou json**, vamos utilizar **form-data**. Dentro dele, na chave, passe o mouse por cima e mude de **Text** para **File**.

Na requisição o nome da chave é **file** e o valor o arquivo.

### 10. Youch (Error Handler)

​	O Youch é responsável por retornar uma mensagem de erro. Para isso, voltaremos no arquivo **app.js**, e adicionaremos algumas coisas, mas primeiro, vamos começar instalando uma nova ferramenta chamada **Youch**, através do comando no terminal `yarn add youch`. O **Youch** é uma biblioteca que já traz consigo as mensagens de erro para que possamos visualizar o que aconteceu. Após intalado, deixe o **app.js** dessa forma:

```javascript
import 'dotenv/config';

import express from 'express';
import path from 'path';
// E aqui a importação
import Youch from 'youch';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }

  // Aqui adicionamos o exceptionHandler
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;

```



​	Aqui apenas fizemos importações, criamos um novo método, e o colocamos dentro do constructor. O método criado, faz uma requisição assíncrona, que no casso receberá o parâmetro de erro primeiro. Um método async, sempre será de erro quando tiver 4 parâmetros. Nele fizemos uma arrow function que irá criar uma variável instanciando o Youch, onde buscará o erro e a requisição feita, mostrando o que aconteceu através de um json. O Youch também pode mostrar em html, mas como estamos usando o conceito de API REST, trabalhamos com json. Agora se testar novamente o erro, verá que aparecerá no insomnia um json dizendo o que aconteceu.

### 11. Brute (Evitando ataques de BruteForce)

#### 11.1 Instalação:

```
yarn add express-brute express-brute-redis
```



------

# Como fazer:

## 1 . Criar novas entidades

### 1.1 Migration e banco

Com as credenciais e o sequelize configuradas, pode-se criar uma **Migration** para criar uma tabela no banco. Exemplificaremos com a criação da **Entidade Usuário.**

```
yarn sequelize migration:create --name=create-users
```

Feito isso observamos que dentro da pasta **migrations** temos o nosso arquivo de migração já criado.

Vamos remover os comentários e aproveitar o conteúdo e vamos começar a definir os campos da nossa tabela.

```javascript
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // A nossa aplicação vai ter usuário de cliente e de funcionários, então
      // teremos esse booleano que será true, qnd o usuário for um funcionário
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  },
};
```

Agora o comando para rodar a migração no banco de dados.

```shell
yarn sequelize db:migrate
```

Agora vamos no **DBeaver** e ver as tabelas.

Vai ter criado todas as tabelas, e criado também o **SequelizeMeta**, que é uma tabela que guarda as **migrations** que já foram executadas.

Se por acaso cometermos algum erro na migração podemos usar:

```shell
# Desfaz a última migration
yarn sequelize db:migrate:undo

# ou que desfaz todas
yarn sequelize db:migrate:undo:all
```

### 1.2 Models

Após criada a migração e a tabela no banco de dados do usuário, vamos criar um arquivo **app/models/User.js**:

```javascript
import Sequelize, { Model } from 'sequelize';

// Toda classe que será usada no sequelize precisa extender Model
class User extends Model {
  // Também precisamos definir um método estático chamado init

  // E aqui dentro nós iremos enviar as colunas que nós teremos dentro da nossa
  // base de dados, evitando todas as colunas chaves primárias e estrangeiras
  // e também não colocar created_at e updated_at
  static init(sequelize) {
    super.init(
      {
          // Aqui são apenas atributos que vão ser passados pelo usuário para criar ou editar o User
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      // Como segundo argumento precisamos passar o objeto sequelize
      {
        sequelize,
        // Aqui dentro poderíamos passar mais configurações
        // Como trocar o nome da tabela
        // tableName: 'exemplo'
      }
    );
  }
}
export default User;
```

## 2. Configurando Redis

Quando utilizamos rotas que enviam email para o usuário, elas estão demorando um pouco mais para concluir a requisição, pois elas esperam a requisição concluir para depois devolver a resposta para o usuário, e isso demora porque depende de um serviço externo de envio de email, que depende da internet, etc, fazendo com que demore para concluir a requisição.

Eu poderia remover o `async`e deixaria mais rápido a execução da requisição, pois o email seria enviado de forma assíncrona também, porém se desse algum problema no envio de email eu não poderia informar isso ao usuário.

A melhor forma de controlar isso é com FILAS, com background jobs, controlar que serviços rodem em segundo plano, e de forma que podemos enviar mensagem para o usuário.

Precismos de um banco não relacional que armazena chave e valor apenas, não tem schemas e nem models. Ele é muito mais performático. E iremos utilizar o Redis no Docker.

Para configurar o https://redis.io/ no docker:

```shell
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
```

A versão com alpine vem bem leve, vem com as features mais essenciais do linux.

Agora vamos instalar o [bee-queue](https://github.com/bee-queue/bee-queue), que é uma ferramenta de **background jobs** no node, ele é mais simples e não tem todos os recursos que outros tem, por exemplo o [kue](https://github.com/Automattic/kue). Mas para essa aplicação já serve. **Kue** é menos performático mas tem mais rebustez. Com **Bee Queue** ele agenda os jobs e faz retentativas de reenvio de email, que é o necessário e suficente para aplicação, por isso escolhemos essa lib.

Para instalar o **bee-queue**:

```shell
yarn add bee-queue
```

Agora criaremos um arquivo chamado **src/lib/Queue.js** e lá dentro vamos configurar tudo que for relacionado com a nossa fila.

```javascript
import Bee from 'bee-queue';

class Queue {
  constructor() {
    // Aqui dentro poderemos ter várias filas. Cada tipo de serviço,
    // ou background job, ele vai ter a sua própria fila.
    // Envio de cancelamento de e-mail, vai ter sua fila. De recuperação de senha outra.
    this.queues = {};

    // E vamos iniciar a fila
    this.init();
  }

  // Chamaremos um método init para dividir a parte de inicialização das filas em outro método.
  // Assim como fizemos nos databases onde tinhamos que importar todos os models
  // Vamos ter que importar uma série de Jobs, todos os trabalhos que ficam dentro de filas são chamados de Jobs.
  init() {}
}

export default new Queue();
```

Também criaremos **app/jobs** que guardaremos todos os nossos background jobs. Agora vamos antes criar uma configuração para o **redis.** Vamos fazer **config/redis.js**:

```
export default {
  host: '127.0.0.1',
  port: 6379
}
```

Agora vamos voltar para o nosso **Queue.js**:

```javascript
import Bee from 'bee-queue';
import redisConfig from '../config/redis';

// Here we import and put our Jobs
const jobs = [];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  proccessQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();

```

Basicamente, o que estamos fazendo até agora? Nós estamos pegando todos os **jobs** e armazenando ele dentro da variável **this.queues**. E dentro do **init()** nós armazenamos a nossa fila, que possui a conexão com o nosso banco não relacional Redis, e também armazenamos o handle, que é o método que vai processar o nosso job, e vai processar e-mail ou fazer qualquer tarefa que precise ser feita em background.

Também fizemos o método **add()** para disparar novos jobs dentro da nossa fila, ou seja, toda vez que um e-mail for disparado, ele é responsável por por um novo job lá dentro da fila. E até aí temos a inicialização da fila, a adição de novos itens na fila, mas ainda não estamos processando as filas. E o processo foi feito com o **processQueue**.

E agora criaremos um último arquivo na pasta **src**, onde estão **app.js e routes.js**, chamado **queue.js**:

```
import Queue from './lib/Queue';

Queue.proccessQueue();
```

**Por que fizemos isso?** Porque **a gente não vai executar a aplicação no mesmo node**, ou seja, na mesma execução **que iremos rodar a fila**. Porque a gente pode estar com a nossa fila rodando no servidor, num núcleo (core) do processador com mais ou menos recursos totalmente separada de nossa aplicação. Agora por exemplo nós temos um primeiro terminal rodando a nossa aplicação com o **yarn dev**, e podemos ter um segundo terminal rodando a fila:

```
node src/queue.js
```

Se der um erro, isso acontece porque aí não estamos utilizando o **Sucrase**. Então o que podemos fazer para ter o **sucraze** rodando nesse arquivo. Vamos em **package.json**, lá nos **scripts**, onde temos o script do **dev**, criaremos outro chamado **queue**:

```
"scripts": {
    "dev": "nodemon src/server.js",
    "queue": "nodemon src/queue.js"
  },
```

Agora só rodar:

```
yarn queue
```

E testar o cancelamento! Vemos agora os números do tempo de resposta que foram extremamente melhores que antes e o nosso e-mail chegou da mesma forma.
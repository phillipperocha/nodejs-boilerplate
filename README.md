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

```
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

```json
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

```json
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

### 4. sequelize & sequelize-cli

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

#### 4.1 Seeds

Agora um conceito muito bacana quando você precisa configurar um ambiente de testes de sua aplicação. Vamos supor que um novo desenvolvedor entra no seu time e instala o software pra ele começar a desenvolver na máquina dele é muito legal se o seu software já vier com alguns dados fictícios, como usuário, administrador, produtos, compras, etc. Para isso podemos utilizar os Seeds.

- São arquivos que populam a base de dados para desenvolvimento, criando usuários, produtos fake.
- Muito utilizado para popular dados para testes.
- Executável apenas por código. (Não conseguimos executar pelo DB, precisam de comando na linha de comando)
- Jamais será utilizado em produção.
- Caso sejam dados que precisam ir para produção, a própria migratoin pode manipular dados das tabelas.

Por exemplo, eu tenho uma tabela chamada *Status do Pedido*, e eu sei que os status são 1, 2, 3 ou 4, Pendente, Aprovado, Completo e Enviado, são status que dificilmente vão mudar e quero que eles já estejam na tabela. Vamos utilizar as migrations em vez dos Seeds.

#### 4.2 Instalação

```shell
yarn add sequelize
# esse sequelize cdi é uma interface de linha de comando pra facilitar a criação de migrations, executá-las, criar models, etc.
yarn add sequelize-cli -D
```

#### 4.3 Link da documentação:

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
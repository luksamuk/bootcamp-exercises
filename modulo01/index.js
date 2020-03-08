const express = require('express');

const server = express();

// Testando query params
server.get('/teste', (req, res) => {
    const nome = req.query.nome;
    
    return res.json({ message: `Hello ${nome}!` });
});

/* * CRUD * */

const users = ['Fulano', 'Ciclano', 'Beltrano'];


/* Middlewares */
// Uso explícito de JSON (obrigatório)
server.use(express.json());

// Middleware global de teste
server.use((req, res, next) => {
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url}`);
    next();
    console.timeEnd('Request');
});

// Middleware local para existência do usuário
const checkUserExists = (req, res, next) => {
    if(!req.body.name) {
        return res.status(400)
            .json({ error: 'User name is required' });
    }
    return next();
};

const checkUserInArray = (req, res, next) => {
    const user = users[req.params.index];
    if(!user) {
        return res.status(404)
            .json({ error: 'User does not exist' });
    }

    // Repasse o usuário através da requisição
    req.user = user;
    
    return next();
};

/* Leitura */

server.get('/users', (req, res) => res.json(users));

server.get('/users/:index', checkUserInArray, (req, res) => {
    return res.json(req.user);
});


/* Criação */

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;
    users.push(name);
    return res.json(users);
});


/* Edição */

server.put('/users/:index', checkUserInArray, checkUserExists,
           (req, res) => {
               const { index } = req.params;
               const { name }  = req.body;
               users[index] = name;
               return res.json(users);
           });


/* Exclusão */

server.delete('/users/:index', checkUserInArray, (req, res) => {
    const { index } = req.params;
    users.splice(index, 1);
    return res.send();
});

server.listen(3000);












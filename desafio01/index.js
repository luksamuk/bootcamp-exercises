const express = require('express');

const server = express();

/* Globais */
var projects = [];
var globalNumRequests = 0;

/* Ferramentas auxiliares */

const findProjectId = (id) =>
      projects.findIndex((proj) => proj.id === id);

/* Middlewares */

// Checa se o projeto existe na lista de projetos.
const checkProjectExists = (req, res, next) => {
    const { id } = req.params;
    const projectIdx = findProjectId(id);
    if(projectIdx == -1) {
        return res.status(404)
            .json({ error: 'Project ID not found' });
    }
    req.projectIdx = projectIdx;
    return next();
};

// Conta e faz log da quantidade de requisições feitas até agora.
const countRequests = (req, res, next) => {
    console.log(`Número de requisições: ${++globalNumRequests}`);
    return next();
};

server.use(express.json());
server.use(countRequests);

/* Rotas */

// POST: /projects
// Cria um novo projeto.
// Corpo: JSON contendo id (string), title (string)
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    if(!id || !title) {
        return res.status(400)
            .json({ error: "Missing project ID or title" });
    }

    if(findProjectId(id) != -1) {
        return res.status(400)
            .json({ error: "Duplicated project ID" });
    }
    
    projects.push({
        id:    id,
        title: title,
        tasks: [],
    });
    return res.json(projects);
});

// GET: /projects
// Lista todos os projetos.
server.get('/projects', (req, res) => res.json(projects));

// PUT: /projects/:id
// Altera o nome de um projeto específico.
// Corpo: JSON contendo title (string)
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { title } = req.body;

    if(!title) {
        return res.status(400)
            .json({ error: "Missing project's new title" });
    }
    
    projects[req.projectIdx].title = title;
    return res.json(projects[req.projectIdx]);
});

// DELETE: /projects/:id
// Deleta um projeto específico
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    projects.splice(req.projectIdx, 1);
    return res.json(projects);
});

// POST: /projects/:id/tasks
// Cria um novo compromisso em um projeto específico.
// Corpo: JSON contendo title (string)
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { title } = req.body;

    if(!title) {
        return res.status(400)
            .json({ error: "Missing task title" });
    }
    
    projects[req.projectIdx].tasks.push(title);
    return res.json(projects[req.projectIdx]);
});

// GET: /teapot
// Café é muito bom, cara.
server.get('/teapot', (req, res) =>
           res.status(418)
           .send("Would you want coffee with that?"));

/* Ponto de entrada */
server.listen(3000);

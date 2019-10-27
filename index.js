const express = require('express');

const server = express();

server.use(express.json());

const projectList = [];

var countOfReq = 0;

function checkId (req, res, next){

    const { id } = req.params;

    const index = projectList.findIndex(proj => {
        return proj.id == id;
    });

    if(index == -1){
        return res.status(400).json({ error: 'Project Id not found'});
    }

    return next();
}

function logReq (req, res, next){
    countOfReq ++;
    console.log(`Number of requests received: ${countOfReq}`);
    return next();
}

server.use(logReq);

server.post('/projects', (req, res) => {
    const {id, title} = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projectList.push(project);

    return res.json(project);
});

server.get('/projects', (req, res) => {
    res.json(projectList);
});

server.put('/projects/:id', checkId, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    const index = projectList.findIndex(proj => {
        return proj.id == id;
    });

    const project = projectList[index];

    project.title = title;

    res.json(project);
});

server.delete('/projects/:id', checkId, (req, res) => {
    const {id} = req.params;

    const index = projectList.findIndex(proj => {
        return proj.id == id;
    });

    const deleted = projectList.splice(index, 1);

    res.json(deleted);
});

server.put('/projects/:id/tasks', checkId,  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const index = projectList.findIndex(proj => {
        return proj.id == id;
    });

    const project = projectList[index];

    project.tasks.push(title);

    res.json(project);

});

server.listen(3000);
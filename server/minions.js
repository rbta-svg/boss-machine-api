const express = require('express');
const db = require('./db.js');
const minionsRouter = express.Router();
const minionsWorkRouter = require('./minionsWork')
// DRY Middleware

minionsRouter.use('/:minionId/work', minionsWorkRouter);


let minionCorrectnessMiddleware = (req, res, next) => {
    let minionObj = req.body;
    if('name' in minionObj && 'title' in minionObj && 'salary' in minionObj) {
        req.minion = minionObj;
        next();
    } else {
        res.status(404).send();
    }
}



// GET requests

minionsRouter.get('/', (req, res, next) => {
    let allMinionArray = db.getAllFromDatabase('minions');
    res.send(allMinionArray);
});

minionsRouter.get('/:minionId', (req, res, next) => {
    let minionId = (req.params.minionId);
    let requestedMinionObj = db.getFromDatabaseById('minions', minionId);
    if(requestedMinionObj) {
        res.send(requestedMinionObj);
    } else {
        res.status(404).send('Requested minion not found.');
    }    
});

// POST requests

minionsRouter.post('/', minionCorrectnessMiddleware, (req, res, next) => {
    let newMinionInstance = db.addToDatabase('minions', req.minion);
    res.status(201).send(newMinionInstance);
})

// PUT requests

minionsRouter.put('/:minionId', minionCorrectnessMiddleware, (req, res, next) => {
    let minionId = req.params.minionId;
    if(minionId) {
        let presentMinionInstance = db.getFromDatabaseById('minions', minionId);
        if(presentMinionInstance) {
            req.minion.id = minionId;
            let updatedMinion = db.updateInstanceInDatabase('minions', req.minion);
            res.send(updatedMinion);
            }
        } else {
            res.status(404).send();
        }
    })

// DELETE requests

minionsRouter.delete('/:minionId', (req, res, next) => {
    let minionId = req.params.minionId;
    if(minionId) {
        let wasDeletionSuccessful = db.deleteFromDatabasebyId('minions', minionId);
        if(wasDeletionSuccessful) {
            res.status(204).send()
        } else {
            res.status(404).send();
        }
    }
})



module.exports = minionsRouter;
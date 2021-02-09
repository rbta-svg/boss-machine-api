const express = require('express');
const ideasRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');
const db = require('./db.js');


// Middlewares


let ideaIdMiddleware = (req, res, next) => {
    let ideaId = req.params.ideaId;
    if(ideaId) {
        let associatedIdea = db.getFromDatabaseById('ideas', ideaId);
        if(associatedIdea) {
            req.ideaId = ideaId;
            req.oldIdea = associatedIdea;
            next();
        }
        else {
            res.status(404).send(); // no idea with that ID in the database
        }
    }
    else {
        res.status(404).send(); // no valid ID provided as a parameter

    }
}

let ideaBodyCorrectness = (req, res, next) => {
    next();
}

let ideaValidKeysChecker = (req, res, next) => {
    if(req.body) {
        let idea = req.body;
        if('name' in idea && 'description' in idea && 'numWeeks' in idea && 'weeklyRevenue' in idea) {
            next();
        } else {
            res.status(404).send();
        }
    } else {
        res.status(404).send();
    }
}








// GET requests

ideasRouter.get('/', (req, res, next) => {
    let allIdeasArray = db.getAllFromDatabase('ideas');
    if(allIdeasArray) res.send(allIdeasArray); else { res.status(404).send(); }
});

ideasRouter.get('/:ideaId', ideaIdMiddleware, (req, res, next) => {
    res.send(req.oldIdea);
});

// POST requests

ideasRouter.post('/', ideaValidKeysChecker, checkMillionDollarIdea, (req, res, next) => {
    let newIdeaInstance = db.addToDatabase('ideas', req.idea);
    if(newIdeaInstance) {
        res.status(201).send(newIdeaInstance);
    }
    else {
        res.status(404).send();
    }

});

// PUT requests

ideasRouter.put('/:ideaId', ideaIdMiddleware, ideaValidKeysChecker, checkMillionDollarIdea, (req, res, next) => {
    req.idea.id = req.ideaId;
    let updatedIstance = db.updateInstanceInDatabase('ideas', req.idea);
    if(updatedIstance) {
        res.send(updatedIstance);
    } else {
        res.status(404).send();
    }


});

ideasRouter.delete('/:ideaId', ideaIdMiddleware, (req, res, next) => {
    let isDeletionSuccessful = db.deleteFromDatabasebyId('ideas', req.ideaId);
    if(isDeletionSuccessful) res.status(204).send();
    else { res.status(404).send() }

});





module.exports = ideasRouter;
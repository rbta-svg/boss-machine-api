const express = require('express');
const db = require('./db.js');
const minionsWorkRouter = express.Router({mergeParams: true});

let validMinionIdCheck = (req, res, next) => { // check if minionId is valid and has a match in the database
    if(req.params.minionId) {
        let associatedMinion = db.getFromDatabaseById('minions', req.params.minionId);
        if(associatedMinion) { 
            next();
        }
        else {
            res.status(404).send()
        }
    }
    else {
        res.status(404).send()
    }
}

let validBodyCheck = (req, res, next) => { // check if the body [for PUT and POST] has the correct key
    let work = req.body;
    if(work) {
        if('title' in work && 'description' in work && 'hours' in work && 'minionId' in work && work.minionId === req.params.minionId) {
/*             console.log('I got here'); */
            req.work = work;
            next();
        } else {
            if(work.minionId !== req.params.minionId) {
                res.status(400).send();
            } else {
            res.status(404).send();
            }
        }
    } else {
        res.status(404).send()
    }

}

minionsWorkRouter.get('/', validMinionIdCheck, (req, res, next) => {
    let allWork = db.getAllFromDatabase('work');
    /* console.log(allWork); */
    let correctWorkArray = [];
    allWork.forEach(workObj => {
        if(workObj.minionId = req.params.minionId) correctWorkArray.push(workObj);
    });
    res.send(correctWorkArray);
})



minionsWorkRouter.put('/:workId', validMinionIdCheck, validBodyCheck, (req, res, next) => { // c'è un problema col DB che non capisco
    let updatedInstance = db.updateInstanceInDatabase('work', req.body);
    if(updatedInstance) {
        res.send(updatedInstance);
    } else {
        res.status(404).send();
    }
});

minionsWorkRouter.post('/', validMinionIdCheck, validBodyCheck, (req, res, next) => {
/*     console.log(req.work); */
    let newWorkInstance = db.addToDatabase('work', req.work);
/*     console.log(newWorkInstance) */
    if(newWorkInstance) {
        res.status(201).send(newWorkInstance);
    } else {
        res.status(404).send();
    }
});

minionsWorkRouter.delete('/:workId', validMinionIdCheck, (req, res, next) => {
    let isDeletionSuccessful = db.deleteFromDatabasebyId('work', req.params.minionId);
    if(isDeletionSuccessful) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
})






module.exports = minionsWorkRouter;
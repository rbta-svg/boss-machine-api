const express = require('express');
const db = require('./db');
const meetingsRouter = express.Router();

// GET request

meetingsRouter.get('/', (req, res, next) => {
    let meetingsArray = db.getAllFromDatabase('meetings');
    if(meetingsArray) {
        res.send(meetingsArray);
    } else {
        res.status(404).send();
    }
});

meetingsRouter.post('/', (req, res, next) => {
    let newMeeting = db.createMeeting();
    /* console.log(newMeeting); */
    if(newMeeting) { // meeting creation successful
        let newInstance = db.addToDatabase('meetings', newMeeting);
        if(newInstance) {
            res.status(201).send(newInstance);
        } else {
            res.status(404).send()
        }
    } else {
        res.status(404).send();
    }
})

meetingsRouter.delete('/', (req, res, next) => {
    let isDeletionSuccessful = db.deleteAllFromDatabase('meetings');
    if (isDeletionSuccessful) res.status(204).send(); 
    else { res.status(404).send() }
})




module.exports = meetingsRouter;

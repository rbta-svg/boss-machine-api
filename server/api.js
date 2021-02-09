const express = require('express');
const apiRouter = express.Router();
const minionsRouter = require('./minions.js');
const ideasRouter = require('./ideas.js');
const meetingsRouter = require('./meetings.js');

// apiRouter path is /api    


apiRouter.use('/minions', minionsRouter); // /api/minions
apiRouter.use('/ideas', ideasRouter); // /api/ideas
apiRouter.use('/meetings', meetingsRouter); // /api/meetings


module.exports = apiRouter;

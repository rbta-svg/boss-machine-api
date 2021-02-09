const ONE_MILLION = 1000000;


const checkMillionDollarIdea = (req, res, next) => {
    let idea = req.body;
    if(idea) { // checking to see if there is an idea
        /* console.log('1'); */
        let weeklyRevenue = idea.weeklyRevenue;
        let numWeeks = idea.numWeeks;
        /* console.log('2'); */
        if(!weeklyRevenue || !numWeeks) { 
            /* console.log('3'); */
            res.status(400).send();
        }
        let yield = weeklyRevenue * numWeeks;
        if(!yield) {
            /* console.log('4'); */
            res.status(400).send();
        }
        if(yield >= ONE_MILLION) {
            /* console.log('5'); */
            req.idea = idea; 
            next();
        }
        else res.status(400).send();

    } else {
        res.status(404).send();
    }
};


// 1. three arguments
// 2. 400 error if yield < 1 mil
// 3. next if yield >= 1 mil
// 4. 400 if numWeeks or weeklyRevenue is not supplied
// 5. 400 if numWeeks or weeklyRevenue is an invalid string
// 6. used in POST to reject unsufficiently profitable idea

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;

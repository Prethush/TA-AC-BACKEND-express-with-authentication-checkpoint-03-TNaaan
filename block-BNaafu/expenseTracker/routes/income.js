let express = require('express');
let router = express.Router();
let Income = require('../models/income');
let User = require('../models/users');

//render income details page
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Income.findById(id, (err, income) => {
        if(err) return next(err);
        console.log(income);
        res.render('incomeDetails', {income});
    })
});

module.exports = router;
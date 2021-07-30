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

//render income edit page
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Income.findById(id, (err, income) => {
        if(err) return next(err);
        income.sources = income.sources.join(" ");
        res.render('incomeEditPage', {income});
    })
});

//edit income
router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.sources = req.body.sources.trim().split(" ");
    Income.findByIdAndUpdate(id, req.body, (err, income) => {
        if(err) return next(err);
        res.redirect('/clients/statementList');
    })
});

//delete income
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Income.findByIdAndDelete(id, (err, income) => {
        if(err) return next(err);
        User.findByIdAndUpdate(income.userId, {$pull: {incomes: id}}, (err, user) => {
            if(err) return next(err);
            res.redirect('/clients/statementList');
        })
       
    })
})
module.exports = router;
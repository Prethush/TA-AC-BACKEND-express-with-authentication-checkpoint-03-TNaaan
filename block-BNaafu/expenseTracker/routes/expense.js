let express = require('express');
let router = express.Router();
let Expense = require('../models/expense');
let User = require('../models/users');

//render expense details page
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Expense.findById(id, (err, expense) => {
        if(err) return next(err);
        res.render('expenseDetails', {expense});
    })
})
module.exports = router;
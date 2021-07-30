let express = require('express');
let router = express.Router();
let Income = require('../models/income');
let Expense = require('../models/expense');
let User = require('../models/users');

router.use((req, res, next) => {
    let expenses = [];
    let incomes = [];
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log(firstDay, lastDay);
    Expense.find({
        date: {
            $gte: firstDay,
            $lt: lastDay
        }, userId: req.user.id
    }, (err, expenses) => {
        if(err) return next(err);
        Income.find({
            date: {
                $gte: firstDay,
                $lt: lastDay
            }, userId: req.user.id
        }, (err, incomes) => {
            if(err) return next(err);
                let sumOfExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let sumOfIncomes = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let savings = sumOfIncomes - sumOfExpenses;
                res.locals.savings = savings;
                res.locals.balance = 0;
                next();
        })
    })    
   
})


//render income create form
router.get('/income/new', (req, res, next) => {
    let info = req.flash('info')[0];
    res.render('incomeCreateForm', {info});
});

//add income
router.post('/income', (req, res, next) => {
    req.body.userId = req.user.id;
    req.body.sources = req.body.sources.trim().split(" ").map(e => e.toLowerCase());
    Income.create(req.body, (err, income) => {
        if(err) return next(err);
        console.log(income);
        User.findByIdAndUpdate(req.user.id, {$push: {incomes: income.id}}, (err, user) => {
            if(err) return next(err);
            req.flash("info", "Income is added");
            res.redirect('/clients/income/new');
        })
    })
});

//render expense create form
router.get('/expense/new', (req, res, next) => {
    let info = req.flash('info')[0];
    res.render('expenseCreateForm', {info});
});

//add expense
router.post('/expense', (req, res, next) => {
    req.body.userId = req.user.id;
    req.body.category = req.body.category.trim().split(" ").map(e => e.toLowerCase());
    Expense.create(req.body, (err, expense) => {
        if(err) return next(err);
        User.findByIdAndUpdate(req.user.id, {$push: {expenses: expense.id}}, (err, user) => {
            if(err) return next(err);
            req.flash("info", "Expense is added");
            res.redirect('/clients/expense/new');
        })
        
    })
});

//render statement page(income and expense list)
router.get('/statementList', (req, res, next) => {
   
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    Expense.find({
        date: {
            $gte: firstDay,
            $lt: lastDay
        }, userId: req.user.id
    }, (err, expenses) => {
        if(err) return next(err);
        console.log(expenses);
        Income.find({
            date: {
                $gte: firstDay,
                $lt: lastDay
            }, userId: req.user.id
        }, (err, incomes) => {
            if(err) return next(err);

            res.render('incomeExpenseStatement', {expenses, incomes});
        })
    }) 
});

//filter by date
router.get('/statementList/filterByDate', (req, res, next) => {
    let expenses = [];
    let incomes = [];
    let {startDate, endDate} = req.query;
    Income.find({date: {
        $gte: new Date(startDate),
        $lt: new Date(endDate)
    }, userId: req.user.id}, (err, incomes) => {
        if(err) return next(err);
        Expense.find({date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }, userId: req.user.id}, (err, expenses) => {
            if(err) return next(err);
            let sumOfExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
            let sumOfIncomes = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
            let balance = sumOfIncomes - sumOfExpenses;
            res.render('incomeExpenseStatement', {incomes, expenses, balance});
        })
    })
});

//filter by month
router.get('/statementList/filterByMonth', (req, res, next) => {
    let expenses = [];
    let incomes = [];
    let year = req.query.month.split("-")[0];
    let month = req.query.month.split("-")[1];
    let date = year + "-"+month+ "-" + "01";
    let firstDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1);
    let lastDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1);
    Income.find({date: {
        $gt:firstDay,
        $lte:lastDay
    }, userId:req.user.id}, (err, incomes) => {
        Expense.find({date: {
            $gt:firstDay,
            $lte:lastDay
        }, userId:req.user.id}, (err, expenses) => {
            if(err) return next(err);
                let sumOfExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let sumOfIncomes = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let balance = sumOfIncomes - sumOfExpenses;
                res.render('incomeExpenseStatement', {incomes, expenses, balance: balance});
        })
    })
    
});


//filter by expense and income source and date

router.post('/statementList/filterByDateAndCategory', (req, res, next) => {
    let expenses = [];
    let incomes = [];
    let {startDate, endDate, incSource, expCategory} = req.body;
    incSource = incSource.split(" ").map(e => e.toLowerCase());
    expCategory = expCategory.split(" ").map(e => e.toLowerCase());
    Income.find({
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate) 
        }, sources: {$in: incSource}, userId: req.user.id
    }, (err, incomes) => {
        if(err) return next(err);
        Expense.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate) 
            }, category: {$in: expCategory}, userId: req.user.id
        }, (err, expenses) => {
            console.log(expenses, incomes)
            if(err) return next(err);
                let sumOfExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let sumOfIncomes = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
                let balance = sumOfIncomes - sumOfExpenses;
                res.render('incomeExpenseStatement', {incomes, expenses, balance});
        })
    })
});



module.exports = router;
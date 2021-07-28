writeCode

#### Expense Tracker

Design an expense tracker application using Express & MongoDB where a logged in user can track their income, expenses and savings.

Each user who logs into the application, will have thier own set of income source, expenses category and saving calculated based on income & expenses.

Implement following features:-

1. Register users

Each user will have

- Name
- Email
- Password
- Age
- Phone
- Country

2. Login users

- login using email/password combination
- login with social OAuth (Github + Google)
- verify email for local login using nodemailer
- reset apssword for local login
- A user can register & then login using email/password or he/she can directly login using social OAuth. Structure schema so that all 3 login data should be saved in same document for a single user.

3. Add Income & Expenses

- Each logged in user can add income along with their sources
- Each added income will have
  - source like salary, trading, bussiness etc..
  - amount
  - date
  - reference to user
  - timestamps()
- Each expenses will have
  - category like health, grocery, lifestyle etc...
  - amount
  - date
  - reference to user
  - timestamps

#### Application Flow

1. Login/Register user

A user can register & then login using email/password combination or directly login using social OAuths.

2. Onboarding Page

Upon successful authentication, user will be redirected to onboarding page where user can add:-

- source of income(could be multiple)
- expense category(could be multiple)
- income for current month

3. Dashboard

On dashboard users can

- view list of incomes, expenses for the current month
- filter by date(from & to)
- filter by source of income & expense category
- filter by a combination of date & category
- display savings for current month
- select inputs for viewing income,expenses and savings for a particular month & year

# Reads statistics from Git for the users on your team

## Setup your repositories

Create a file in the root of this project called repos.txt.
Add a line for each target repository.

example:
/Users/jakobjonasson/.tempo/firstproject/.git
/Users/jakobjonasson/.tempo/secondproject/.git

## Setup users on your team

Create a file in the root of this project called users.txt.
Add a line for each target username.

example:
john
mike

## Get the reports

Get a report for today
node ./src/index.js

Get a report since a day
node ./src/index.js 2008-01-01

Get a report since a day, with daily intervals
node ./src/index.js 2008-01-01 day

Get a report since a day, with weekly intervals
node ./src/index.js 2008-01-01 week

Get a report since a day, with montly intervals
node ./src/index.js 2008-01-01 month

Get a report since a day, with yearly intervals
node ./src/index.js 2008-01-01 year

## Run tests

npm run test
npm run test -- --watch
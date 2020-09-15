# Reads statistics from Git for the users on your team

## Setup your repositories

Create a file in the root of this project called repos.txt.
Add a line for each target repository.

example:
/Users/jakobjonasson/firstproject/.git
/Users/jakobjonasson/secondproject/.git

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
node ./src/index.js since=2008-01-01

Get a report until a day
node ./src/index.js until=2008-01-01

Get a report with a given interval
node ./src/index.js since=2008-01-01 interval=day
node ./src/index.js since=2008-01-01 interval=week
node ./src/index.js since=2008-01-01 interval=month
node ./src/index.js since=2008-01-01 interval=year

Get a list report
node ./src/index.js since=2008-01-01 type=list

Combine parameters to create a complex report
node ./src/index.js since=2019-03-01 until=2020-04-01 interval=month type=list

## Run tests

npm run test
npm run test -- --watch

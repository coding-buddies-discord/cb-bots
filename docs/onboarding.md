# Onboarding 👀🤖

Coding Buddies Bot is a bot that serves the Coding Buddies Discord community. The goal is for it to be a safe, open-source project for anyone the a basic understnading of Javascript. It aims to provide opportutnity to work within a team setting and provide opportunity for collaboration on a low-stakes, but production, project.

***If you have questions, feedback, suggestions about this guide, please speak up 📢 .***

## Joining The Community 🏡 🤝

Coding Buddies is a Discord community where we get together to make new friends and build a community around all things code. There are two servers, Coding Buddies and cb bot development server.

#### Coding Buddies
 The main server for the community production version of the bot runs in this server. This is where we use what we build. [Join](https://discord.gg/HBjyUt5R) When you join, please answer the bot (that you'll be working on soon 🎉) and

#### cb cod development
A bot development server for Buddies contributing to the bot. When you run the bot locally, this is the server the bot will run.

## Getting Started with The Bot 🚦

**Things you'll need**:

- Basic understanding of javascript
- Node JS (16 or later)
- MongoDB - (local or atlas)
- Environment File

## Getting your database set up

The bot utilizes MongoDB so you'll need access to MongoDB community addition and a local running instance of it. You can also run it with [MognoDB Atlas](https://www.mongodb.com/atlas/database), there is more on this under Configuring The Bot.

- [Download MongoDB Community](https://www.mongodb.com/try/download/community-kubernetes-operator)
- [Installing on Ubuntu (<= 20.04)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- [Installing on MacOs](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- [Installing on Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)

The bot runs against a collection called `buddies`, so you will need to add a collection with this name to your db.

We also recommend using [Compass](https://www.mongodb.com/products/compass) GUI to interact with your database.

## Configuring The Bot ⚙️

You'll need an [enviornment file](https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html). This file tells contains the development server id, the general channel id, the bot token, and Mongo URI. To get access to this file, please reach out to @earn.

Once you receive this file, put it in the root of your project.

**Note**: if you are using a local instance of MongoDB and it's running port, nothing should have to change in the ENV file. If you are using Atlas you will have to update the `MONGO_URI` to the database you have running in the Atlas cloud.

## Running the Bot 🏃‍♀️

To run the bot you'll install all the depdencies the bot needs. To do this, simply run `npm install` or `yarn install`.

Once you've gotten your ENV file added and your depdencies installed, you should be able to run the bot. To do this, simply run `npm start` or `yarn start`. Your terminal should tell you when the bot has started. It will say:

`Ready as Bot Buddy#9722`

Go to any channel in `cb bot developement` channel and type `!ping` you should get a response back.

It's also good practice to post in #general and say you're running the bot.

If you encounter errors, see Troubleshooting below.



## Troubleshooting ⁉️

As part of your onboarding, as you run into questions, it would be really helpful to document them so that we can start to build a collection of FAQs and answer them quickly for new contributors.

Please also create an issue with your question inside of Github and label it as `help` and assign it to `waream2`

If you run into trouble, don't sweat. Simply post inside of #bot-build, tag @here and someone will surely be stoked help. *If you're having trouble and frustrated by this step, don't fret. Configuring projects can be the hardest part. Someone will be sure to help get you started and hopefully help teach you so you can help the next person.* 🤗
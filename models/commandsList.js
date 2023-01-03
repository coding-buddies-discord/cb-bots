// Add new commands to this array.
const commandsList = [
  {
    command: '!ping',
    description: 'View the bot response time in milliseconds.',
  },
  {
    command: '@user++',
    description:
      'If a user has been helpful to you, mention their username and add ++ to give them a point.',
  },
  {
    command: '!points',
    description:
      'View the top 8 users who have been given the most points in the current channel. Add --g to the end to see a points report for the entire server. ',
  },
  {
    command: '!js',
    description:
      'Paste javascript code after this command to have the bot format it. Can also be used for css and html.',
  },
  { command: '!goodbot', description: 'Show the bot some praise' },
];

export default commandsList;

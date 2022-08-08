export default {
  name: 'ready',
  once: true,
  execute(client) {
    const { username, discriminator } = client.user;
    console.log(`Ready as ${username}#${discriminator}!`);

    client.user.setPresence({
      status: 'online',
      activities: [{ name: 'The buddies bot 🤖', type: 'PLAYING' }],
    });
  },
};

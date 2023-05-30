import { Client } from 'discord.js';
import lecronJames from './leCronJames.js';

export default {
  name: 'ready',
  once: true,
  execute(client: Client) {
    const { username, discriminator } = client.user;
    console.log(`Ready as ${username}#${discriminator}!`);

    client.user.setPresence({
      status: 'online',
      activities: [{ name: 'The buddies bot 🤖', type: 'PLAYING' }],
    });

    lecronJames(client);
  },
};

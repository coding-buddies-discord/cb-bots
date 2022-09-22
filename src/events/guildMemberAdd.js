// import { MessageEmbed } from "discord.js";
import { addUserToPoints } from '../../db.js';

export default {
  name: 'guildMemberAdd',
  execute(member) {
    const welcomeGifs = [
      'https://media.giphy.com/media/keTwQbbQwlNM2RNJsW/giphy.gif',
      'https://media.giphy.com/media/IThjAlJnD9WNO/giphy.gif',
      'https://media.giphy.com/media/tczJoRU7XwBS8/giphy.gif',
      'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif',
    ];

    const randomGif =
      welcomeGifs[Math.floor(Math.random() * welcomeGifs.length)];
    const welcomeChannel =
      member.guild.channels.cache.get('950578248784420874');
    const newMember = member.user.toString();

    const welcomeMessage = `Hey ${newMember}, welcome to Coding Buddies, we're lucky to have you here.\nWhen you have a second, could you please tell us a little about yourself:\n1) Where you're from.\n2) Where you are in your coding journey.\n3) Goals you have for coding.\n4) How you found the server.\nReach out to @admin if you have any questions or feedback requests for the server.\nWe're all here to learn and grow together. Happy Coding!`;
    welcomeChannel?.send(welcomeMessage);
    welcomeChannel?.send(randomGif);
    addUserToPoints(member.user.id);
  },
};

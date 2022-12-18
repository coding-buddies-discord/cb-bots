// import { MessageEmbed } from "discord.js";
import BuddiesModel from '../../models/BuddiesModel.js';

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

    const welcomeMessage = `Hey ${newMember}, welcome to Coding Buddies, we're lucky to have you here.
When you have a second, could you please tell us a little about yourself:
  1- Where you're from.
  2- Where you are in your coding journey.
  3- Goals you have for coding.
  4- How you found the server.
    
Tip: in Coding Buddies we have our own bot, which, among other things, enables us to award points to one another when we see fit.
If a user has been helpful to you, mention their username and add ++ to give them a point! E.g. '@username++'
Reach out to @admin if you have any questions or feedback requests for the server.
We're all here to learn and grow together. Happy Coding!`;
    welcomeChannel?.send(welcomeMessage);
    welcomeChannel?.send(randomGif);
    BuddiesModel.addUserToPoints(member.user.id);
  },
};

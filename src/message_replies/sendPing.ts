import { Client, Message, MessageEmbed } from 'discord.js';

const sendPing = (message: Message, client: Client): void => {
  const ping = client.ws.ping;
  const embed = new MessageEmbed()
    .setColor('RANDOM')
    .setAuthor({
      name: message.author.tag,
      iconURL: message.author.avatarURL(),
    })
    .setDescription(ping + 'ms From Bot API')
    .setTimestamp()
    .setFooter({
      text: 'Pong!',
      iconURL: client.user.avatarURL(),
    });
  message.reply({ embeds: [embed] });
};

export default sendPing;

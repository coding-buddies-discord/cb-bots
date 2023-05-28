import { Message } from 'discord.js';

const invalidPoint = (message: Message, mentionId: string) => {
  message.channel.send(
    `Yo <@!${message.author.id}>, you have to wait at least a minute to give <@!${mentionId}> another point.😅`
  );
};

export default invalidPoint;

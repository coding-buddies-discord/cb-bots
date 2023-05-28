import { Message, User } from 'discord.js';

export type validUser = {
  username: string;
  validUser: boolean;
  user?: User;
};

export const isUserValid = async (
  message: Message,
  userId: string
): Promise<validUser> => {
  try {
    // eslint-disable-next-line no-unused-vars
    const user = await message.guild.members.fetch(userId);
    const newUser = user.user;
    return { username: newUser.username, validUser: true, user: newUser };
  } catch (err) {
    return { username: 'Unknown', validUser: false };
  }
};

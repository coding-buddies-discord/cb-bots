import { Message, User } from 'discord.js';

type validatedUser = {
  username: string;
  validUser: boolean;
  user?: User;
};

export const isUserValid = async (
  message: Message,
  userId: string
): Promise<validatedUser> => {
  try {
    const user = await message.guild.members.fetch(userId);
    const newUser = user.user;
    return { username: newUser.username, validUser: true, user: newUser };
  } catch (err) {
    return { username: 'Unknown', validUser: false };
  }
};

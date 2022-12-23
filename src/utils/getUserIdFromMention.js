export const getUserIdFromMention = (command) => {
  const userId = command.match(/(?!0)+(\d)+/g);

  return userId?.[0] || 0;
};

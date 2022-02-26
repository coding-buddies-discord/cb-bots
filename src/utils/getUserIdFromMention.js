export const getUserIdFromMention = (command) => {
	const userId = command.match(/\d+/g);
	return userId[0] || false;
};

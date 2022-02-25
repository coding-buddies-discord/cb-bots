export const getUserIdFromMention = (command) => {
	const subString = command.match(/\d/g);
	return subString.join('');
};

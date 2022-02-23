export const getUserIdFromMention = (command) => {
	const subString = command.split(/[!>]/);
	return subString[1];
};

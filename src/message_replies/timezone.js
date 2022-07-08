
const timezone = (interaction) => {
	const { content } = interaction;
	const flag = findFlag(content);

	if (!flag || flag === "--help") {
		helpFlag(interaction);
	}

	const value = findValue(flag, content);
	const requiresValue = ["--update", "--sub", "--get"].includes(flag);

	if (!value && requiresValue) {
		return interaction.reply(
			"it appears that you used the command `!timezone` without any value passed to the flag.\nuse `!timezone` or `!timezone --help to see the list of commands`"
		);
	}

	switch (flag) {
		case "--update":
		case "--sub":
			return subToTimezone(value, interaction);
		case "--unsub":
			return unsubToTimezone(interaction);
		case "--get":
			return getUserTimezone(interaction, value); // get the current value to the user
		default:
			break;
	}
};

export default timezone;

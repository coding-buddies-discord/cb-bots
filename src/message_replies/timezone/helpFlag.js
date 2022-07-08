const timezoneFlags = {
	"--help": "Lists all available flags for the command.",
	"--update": "Allows the user to update the timezone to a new one using the country abbreviation.\nEx: `!timezone --update ES`",
	"--get": "Get the current time of the user informed.\nEx: `!timezone --get `<@!939602133005774858>",
	"--sub":
		"Subscribes the user to the timezone command using the country abbreviation.\nEx: `!timezone --sub US`",
	"--unsub": "Unsubscribes the user to the timezone command.",
};

const helpFlag = (interaction, flags = timezoneFlags) => {
	let flagsStr = "This is the list of all available flags for the `!timezone` command:";
	 Object.entries(flags).map((arr) => {
		const [name, description] = arr;
		flagsStr += `\n\n**${name}**: ${description}`;
	});
	interaction.reply(flagsStr);
};

export default helpFlag;

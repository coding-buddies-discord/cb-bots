import { channelPoints } from "../../db.js";
import { isUserValid } from "../utils/isUserValid.js";

const channelPointsMessage = async (interaction) => {
	const  { channelId } = interaction;
	const topPointEarners = channelPoints(channelId, 5);

  if (topPointEarners.length === 0) return interaction.reply("There's no points in this channel yet.");
  
  const validUsers = [];
  for (const { userID, points } of topPointEarners) { 
    if (points === 0 ) continue;
    const {username, validUser} = await isUserValid(interaction, userID);
    if (validUser ) validUsers.push({username, points});
  }
  
  const message = validUsers.reduce((acc, {username, points}) => {
    return acc + `${username}: ${points} Points\n`;
  }, `Those are the top ${validUsers.length} on <#${channelId}>:\n`);
	
  interaction.reply(message);
};

export default channelPointsMessage;

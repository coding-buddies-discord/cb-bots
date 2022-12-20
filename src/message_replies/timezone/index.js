import helpFlag from './helpFlag.js';
import getUserTimezone from './getUserTimezone.js';
import subOrUpdateToTimezone from './subToTimezone.js';
import unsubToTimezone from './unsubToTimezone.js';
import { findFlagAndValue } from '../../utils/flagCommands.js';

const timezone = (interaction) => {
  const { content } = interaction;
  const { flag, value } = findFlagAndValue(content);

  if (!flag || flag === '--help') {
    helpFlag(interaction);
  }

  const requiresValue = ['--update', '--sub', '--get'].includes(flag);

  if (!value && requiresValue) {
    return interaction.reply(
      'it appears that you used the command `!timezone` without any value passed to the flag.\nuse `!timezone` or `!timezone --help to see the list of commands`'
    );
  }

  switch (flag) {
    case '--update':
    case '--sub':
      return subOrUpdateToTimezone(value, interaction, flag);
    case '--unsub':
      return unsubToTimezone(interaction);
    case '--get':
      return getUserTimezone(interaction, value);
    default:
      break;
  }
};

export default timezone;

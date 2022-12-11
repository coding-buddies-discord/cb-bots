import cron from 'node-cron';

const { GENERAL_CHANNEL } = process.env;

const lecronJames = async (client) => {
  const channel = client.channels.cache.get(GENERAL_CHANNEL);

  const endOfWeekShout = cron.schedule(
    '0 30 8 * * FRI',
    () => {
      channel.send(
        "@here Happy Friday Coding Buddies! Drop your weekly wins below, doesn't matter how big or small, code or not! 🎉👇 Let's hear it..."
      );
    },
    {
      timezone: 'America/New_York',
    }
  );

  endOfWeekShout.start();
};

export default lecronJames;

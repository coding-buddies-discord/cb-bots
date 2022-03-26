import { CronJob } from 'cron';
import { userActivity } from '../../db.js'



// '0 10 30 * *'
const job = new CronJob('* * * * *', () =>'a', null, true, 'America/Los_Angeles');

export default job

const cron = require('node-cron');
const sql = require('../config/db');

cron.schedule('*/1 * * * *', () => {
  console.log('running unlockCollections now');
  sql.query(
    `UPDATE cws_business.cases SET currentStatus = 'Open' WHERE currentStatus = 'Locked' AND lockedDatetime < (now() - interval 30 minute);`,
    function (err, res) {
      if (err) {
        console.log('unlockCollections error: ', err);
        //result(null, err);
      } else {
        console.log('Collections records unlocked: ', res.affectedRows);
      }
    }
  );
});

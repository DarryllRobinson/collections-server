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

// Cases due today or older email cron
cron.schedule(
  '*/1 * * * *',
  () => {
    console.log('running sql emailToday');
    sql.query(
      `SELECT * FROM cws_business.cases
    WHERE cases.nextVisitDateTime > (Now() - interval 1440 minute)
    AND cases.nextVisitDateTime IS NOT NULL;`,
      function (err, res) {
        if (err) {
          console.log('sql emailToday error: ', err);
        } else {
          let usersRaw = [];
          res.forEach((record) => {
            // get list of users
            usersRaw.push(record.currentAssignment);
          });

          const users = usersRaw.filter(onlyUnique);
          let api = '';
          switch (process.env.REACT_APP_STAGE) {
            case 'development':
              api = 'http://localhost:3000/';
              break;
            case 'production':
              api = 'https://thesystem.co.za/';
              break;
            case 'sit':
              api = 'https://sit.thesystem.co.za/';
              break;
            case 'uat':
              api = 'https://uat.thesystem.co.za/';
              break;
            default:
              port = 0;
              break;
          }

          users.forEach((user) => {
            let casesArray = [];
            res.forEach((record, idx) => {
              if (record.currentAssignment === user) {
                casesArray[
                  idx
                ] = `<p>Case ID ${record.caseId} is due by ${record.nextVisitDateTime}. Click <a href="${api}workzone/collections/collection/${record.caseId}" >here</a> to be taken to the case.</p>`;
              }
            });
            let cases = casesArray.join('\n');

            // send email for each user
            const emailObject = {
              purpose: 'emailToday',
              //to: user,
              to: 'darryll@thesystem.co.za',
              subject: 'The System - Cases for today',
              text: 'Please go to your dashboard to see your work for today',
              html: `
              <p>Good morning. Below is your list of cases for today.</p>
              ${cases}
            `,
            };

            email.send_today(emailObject);
          });
        }
      }
    );

    console.log('business emailToday complete');
  },
  {
    scheduled: false,
  }
);

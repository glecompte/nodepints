const express = require('express');
const app = express();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'beers',
  password : 'metrocin',
  database : 'raspberrypints'
});


app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/api/config', (req, res) => {
  connection.query('SELECT * FROM config', function(err, rows, fields) {
    if (err) throw err;
    res.json(rows)
  });
});

app.get('/api/activetaps', (req, res) => {
  // const param = req.query.q;

  // if (!param) {
  //   res.json({
  //     error: 'Missing required parameter `q`',
  //   });
  //   return;
  // }

  connection.query('SELECT * FROM vwGetActiveTaps', function(err, rows, fields) {
    if (err) throw err;

    //console.log('The solution is: ', rows[0]);
    res.json(rows)
  });
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

const express = require('express');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// default option
app.use(fileUpload());

// Static Files
app.use(express.static('public'));
app.use(express.static('upload'));

// Templating engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'dbgenshin.cmywhljzxxnf.ap-southeast-1.rds.amazonaws.com',
  port:'3306',
  user: 'admin',
  password: '01682998982',
  database: 'userprofile2'
});

pool.getConnection((err, connection) => {
  if (err) throw err; // not connected
  console.log('Connected!');
});

app.get('', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('SELECT * FROM user ', (err, rows) => {
      // Once done, release connection
      connection.release();
      if (!err) {
        res.render('index', { rows });
      }
    });

  });
});


app.post('', (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // name of the input is sampleFile
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/upload/' + sampleFile.name;

  console.log(sampleFile);

  // Use mv() to place file on the server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    pool.getConnection((err, connection) => {
      if (err) throw err; // not connected
      console.log('Connected!');

      connection.query(`INSERT INTO user (name, profile_image) VALUES ('${req.body.name}','${sampleFile.name}')`, (err, rows) => {
        // Once done, release connection
        connection.release();

        if (!err) {
          res.redirect('/');
        } else {
          console.log(err);
        }

      });
    });

    // res.send('File uploaded!');
  });
});

app.get('/item',(req, res, )=>{
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected
    console.log('Connected!');

    connection.query('SELECT * FROM user ', (err, rows) => {
      // Once done, release connection
      connection.release();
      if (!err) {
        res.render('item', { rows });
      }
    });

  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
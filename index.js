const express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// get all todos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

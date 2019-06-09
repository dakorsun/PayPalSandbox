const express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , bodyParser = require('body-parser')
  , {port} = require('./config/env');
const app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress;', true)
    .use(nib())
}
const {getClientToken, receivePaymentMethodNonce} = require('./services/PayPalService');


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(stylus.middleware(
  { src: __dirname + '/views'
    , compile
  }
));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res, next) => {
  console.log(req.method, req.url);
  next();
})

app.get('/client_token', getClientToken);

app.post('/checkout', receivePaymentMethodNonce);

app.get('/', function (req, res) {
  res.render('index', {title: 'Purchase it'})
});



app.post('/purchase', (req, res) => {

});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

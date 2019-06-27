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

const {getClientToken, receivePaymentMethodNonce, getTransaction} = require('./services/PayPalBraintreeService');


app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(stylus.middleware(
  {
    src: __dirname + '/views'
    , compile
  }
));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use('/', (req, res, next) => {
  console.log(req.method, req.url);
  next();
})

app.get('/plan_id/:name', (req, res) => {

    res.send({plan_id: 'P-0SW61816J01847330LUJEURY'})
  }
);

app.get('/client_token', getClientToken);

app.get('/checkout/:id', getTransaction);


app.post('/checkout', receivePaymentMethodNonce);

app.post('*', (req, res) => {
  console.log(req)

})


app.get('/', function (req, res) {
  res.render('index', {title: 'Purchase it'})
});


app.post('/purchase', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

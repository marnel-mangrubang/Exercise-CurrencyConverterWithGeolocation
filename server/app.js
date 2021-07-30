const express = require('express');
var https = require('https');
const axios = require('axios');
const app = express();
const ratesByCountryName = require('./utils/conversionRates');
const { validator, getConversionRateBasedOnCurrencyCode } = require('./utils/helper');



app.get('/api', (req, res) => {
  try{
    return res.status(200).json({ message: 'Hello from api!' });
  }catch(e){
    console.error(e);
  }
});

/*
 * Returns the currencies that this currency converter supports.
*/
app.get('/api/currencies', (req, res) => {
  return res.status(200).send(Object.values(ratesByCountryName));
});

/*
 * Returns the converted currency amount.
*/
app.get('/api/currencyConverter', validator, (req, res) => {
  try{

    const fromCurrency = req.query.from;
    const toCurrency = req.query.to;
    const amountCurrency = req.query.amount;
    
    const fromConversionRate = getConversionRateBasedOnCurrencyCode(fromCurrency);
    const toConversionRate = getConversionRateBasedOnCurrencyCode(toCurrency);

    const newConversionRate = 1.0 / fromConversionRate['rateFromUSDToCurrency'] * toConversionRate['rateFromUSDToCurrency'];

    const amountInToCurrency = amountCurrency * newConversionRate;

    const responseObject = {
      amount: amountInToCurrency,
      conversionRate: newConversionRate,
    }

    return res.status(200).send(responseObject);

  } catch(error) {
    return res.status(500).send({ statusCode: '500', message: '/api/currencyConverter Server error' });
  }
});




/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', async(req, res) => {

  try{
      //Create a new custom agent and set the rejectUnauthorized option to false
      const agent = new https.Agent({  
        rejectUnauthorized: false
      });
      //Call passing in custom agent
      const response = await axios.get('https://ipapi.co/json/', { httpsAgent: agent });

      return res.status(200).send({statusCode: '200', currency: response.data.currency});

  }catch(error){
    console.error(error);
    return res.status(500).send({ statusCode: '500', message: '/api/locationToCurrency Server error' });
  }

  // res.status(503).send('Not Implemented');
});




module.exports = app;
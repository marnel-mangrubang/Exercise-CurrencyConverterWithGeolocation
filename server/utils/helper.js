const ratesByCountryName = require('./conversionRates');
const rates = Object.values(ratesByCountryName);


const validator = (req, res, next) => {
    //Deconstructing req.query so no need for new additional variables
    const { from, to, amount } = req.query;
    
    const regex = '^[a-zA-Z]{3}$'; //Regex to match currencyCode values
    const amountRegex = /^\d+(?:\.\d{1,2})?$/; //Regex to match amount value

    //FROM Validator
    //Validate to see if the 'From' code is at most 3letters long and are only letters
    if(!from.match(regex)){
        return res.status(400).send({statusCode:'400', message: `'${from}' currencyCode is an Invalid Format!`});
    }
    //Check to see if 'From' currencyCode is even one of the currency thats in the list
    if(!getConversionRateBasedOnCurrencyCode(from)){
        return res.status(400).send({statusCode:'400', message: `'${from}' currencyCode  is not supported.`});
    }


    //TO Validator
    //Validate to see if the 'To' code is at most 3letters long and are only letters
    if(!to.match(regex)){
        return res.status(400).send({statusCode:'400', message: `'${to}' currencyCode is an Invalid Format!`});
    }
    //Check to see if 'To' currencyCode is even one of the currency thats in the list
    if(!getConversionRateBasedOnCurrencyCode(to)){
        return res.status(400).send({statusCode:'400', message: `'${to}' currencyCode  is not supported.`});
    }


    //AMOUNT Validator
    //Check if the amount passed is even a number
    if(isNaN(amount)){
        return res.status(400).send({statusCode:'400', message: `'${amount}' is not a number.`});
    }
    //Check if amount passed is less than or equal to 0
    if(amount <= 0){
        return res.status(400).send({statusCode:'400', message: `'${amount}' needs to be greater than 0.`});
    }
    //Check to see if the passed amount matches the required currency format at maximum of 2 decimal places
    if(!amount.match(amountRegex)){
        return res.status(400).send({statusCode:'400', message: `'${amount}' is not an acceptable currency format.`});
    }

    next();

}


//Find the correct conversionRate from the list and return that matching object
const getConversionRateBasedOnCurrencyCode = (currencyDirection) => {
    return rates.find(rate => rate.currencyCode.toUpperCase() === currencyDirection.toUpperCase());
}


module.exports = { validator, getConversionRateBasedOnCurrencyCode };
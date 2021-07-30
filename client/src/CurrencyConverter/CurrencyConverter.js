import React, {useState, useEffect} from "react";
import "./CurrencyConverter.css";
import "@alaskaairux/auro-button";
import "@alaskaairux/auro-input";
import "@alaskaairux/design-tokens/dist/tokens/CSSCustomProperties.css"


const CurrencyConverter = () => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [conversionError, setConversionError] = useState('');

  const [amountMessage, setAmountMessage] = useState('');
  const [fromMessage, setFromMessage] = useState('');
  const [toMessage, setToMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const updateAmount = (event) => {
      reset();
      //Added a regex here to validate that the amount input value matches the correct currency format
      var regex  = /^\d+(?:\.\d{1,2})?$/;
      if (event.target.value.match(regex)){
        setAmountMessage('');
        setSuccessMessage('');
        setErrorMessage('');
        setAmount(event.target.value, [amount]);
      }else{
        setAmountMessage('Please enter a valid amount format!');
        setAmount(0);
        setSuccessMessage('');
        setErrorMessage('Error in the form');
      }
  };


  const updateFromCurrency = (event) => {
    reset();
    setFromMessage('');
    setFromCurrency(event.target.value);
  };



  const updateToCurrency = (event) => {
    reset();
    setToMessage('');
    setToCurrency(event.target.value);
  };




  const reset = () => {
    setConvertedAmount(0);
    setConversionRate(0);
    setConversionError(null);
  }

  const convertFunds = (e) => {
    e.preventDefault();

    //Checks if amount is 0, empty string, null or undefined
    if(amount === 0 || amount === '' || amount === null || amount === undefined){
      setAmountMessage('Please enter an amount to convert')
      return false;
    }
    //Check if fromCurrency value is not selected from the dropdown
    if(!fromCurrency){
      setFromMessage('Please select a from currency!')
      return false;
    }
    //Check if toCurrency value is not selected from the dropdown
    if(!toCurrency){
      setToMessage('Please select a to currency!')
      return false;
    }

    //Check if all 3 required values exist before making the API call
    if(amount && fromCurrency && toCurrency){

      try {
        fetch(`/api/currencyConverter?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`)
        .then(async (response) => {
          if (!response.ok) {
            throw await response.json();
          }
          return response.json()
        })
        .then((body) => {
          setConvertedAmount(body.amount);
          setConversionRate(body.conversionRate);
          setSuccessMessage('You have successfully converted currency!')
        }).catch(error => {
          console.error(error);    
          setConversionError(error.message);
        });
      } catch (error) {
        console.error(error)
      }
    }



  }

  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((body) => setSupportedCurrencies(body));

    //Make an initial fetch to the  /api/locationToCurrency endpoint to grab the persons local currency
    fetch('/api/locationToCurrency')
      .then(response => response.json())
      .then(data => {

        //Check to see if the persons local currency is one of the listed currency
        const isInList = supportedCurrencies.filter(curr => curr.currencyCode === data.currency);

        //If local currency is one of the listed currency, then set the default fromCurrency to the local currency
        if(isInList){
          setFromCurrency(data.currency)
        }else{
          //Set the default "From" currency to be "USD" if their local currency is not on the list
          setFromCurrency('USD') 
        }
      }).catch(function(error) {
        console.log(error);
      });    



  }, []);




  return (
    <div className="CurrencyConverter">
      <auro-header level="1" display="800">Currency Converter</auro-header>
      <auro-header level="4" display="200">Select amount and currency you would like to convert.</auro-header>
      <div>
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Amount: </label>
          <input className="form-control amount" name="amount" type="number" 
          onChange={updateAmount}
          ></input>

          {/* Tried using the auro-input component but doesnt seem to support onChange events */}
          {/* <auro-input
            type="number"
            id="amount"
            name="amount"
            label="Amount"
            onChange={updateAmount}
            onBlur={validateAmount}
            required
            noValidate>
          </auro-input> */}
          <p className="error-message">{amountMessage}</p>
          

        
        </div>
        <div className="form-group">
       
          <label className="form-label" htmlFor="from">From this currency </label>
          <select
            onChange={updateFromCurrency}
            name="from"
            value={fromCurrency}
            className="form-select"
          >
            <option value="" disabled>
              Select a currency
            </option>
            {supportedCurrencies.map((currency, index) => (
              <option key={index} value={currency.currencyCode}>
                {currency.fullCurrencyName} ({currency.currencyCode})
              </option>
            ))}
          </select>
          <p className="error-message">{fromMessage}</p>
        </div>
        <div className="form-group">
        <label className="form-label" htmlFor="to">To this currency </label>
          <select
            onChange={updateToCurrency}
            name="to"
            defaultValue=""
            className="form-select"
          >
            <option value="" disabled>
              Select a currency
            </option>
            {supportedCurrencies.map((currency, index) => (
              <option key={index} value={currency.currencyCode}>
                {currency.fullCurrencyName} ({currency.currencyCode})
              </option>
            ))}
          </select>
          <p className="error-message">{toMessage}</p>
        </div>
      </div>
      <auro-button fluid onClick={convertFunds}>Convert</auro-button>
      
      <div className="result">
        {(convertedAmount && conversionRate) ? 
        <>
            <p className="conversion">
            <strong>{amount} ({fromCurrency}) = {convertedAmount} ({toCurrency})</strong>
            </p>
            <p className="conversion-rate">Conversion rate (updates daily): 1 {fromCurrency} =  {conversionRate} {toCurrency}</p>
        </> : ``}
        {conversionError != null ? <p>{conversionError}</p>: ``}
        <p className="fine-print">Purchases at alaskaair.com are in U.S. dollars.</p>
        <p className="error-message">{errorMessage}</p>
        <p className="success-message">{successMessage}</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
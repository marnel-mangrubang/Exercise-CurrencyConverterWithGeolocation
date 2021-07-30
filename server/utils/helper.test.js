const { validator, getConversionRateBasedOnCurrencyCode } = require("./helper");

describe('Test "getConversionRateBasedOnCurrencyCode" helper function', () => {

    //Returned Value should be of Object type
    test("Returned Value should be of Object type", () => {
        const result = getConversionRateBasedOnCurrencyCode("USD");
        expect(result).toBeInstanceOf(Object);
    });

    //Returned value should be undefined
    test("Returned value should be undefined", () => {
        const result = getConversionRateBasedOnCurrencyCode("USDA");
        expect(result).toBe(undefined);
    });

    //Returned value should not be false
    test("Returned value should not be false", () => {
        const result = getConversionRateBasedOnCurrencyCode("CAD");
        expect(result).not.toBe(false);
    });

    //Returned value should not be false
    test("Returned value should be USD", () => {
        const result = getConversionRateBasedOnCurrencyCode("USD");
        expect(result.currencyCode).toBe('USD');
    });



});

//Wanted to have tests for my validator function but I could not figure out how to pass in the request query.
//Looked into using nock but could not get it to work.
describe('Test "validator" helper function', () => {

    test("Test incoming value truthiness", () => {
        expect(validator).not.toBeNull();
        expect(validator).toBeTruthy();
    });


});
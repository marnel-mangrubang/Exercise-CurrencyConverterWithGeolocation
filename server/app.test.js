const request = require('supertest');
const app = require('./app');


//Testing /api/currencies to make sure that we are getting the list of currency conversion rates
describe('Test /api/currencies', () => {
  test('Returns the list of currency conversion rate objects', async () => {
    const response = await request(app).get('/api/currencies');
    expect(response.statusType).toBe(2);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  });
});



//Testing /api/currencyConverter route
describe('Test /api/currencyConverter', () => {
  test('Returns correct conversion for USD to USD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=USD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(10);
  });

  test('Returns correct conversion for USD to CAD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=CAD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(12.07);
  });

  test('Returns correct conversion for USD to DZD', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZD&amount=10');
    expect(response.statusCode).toBe(200);
    expect(response.body.amount).toBe(975.6);
  });

  //Test to see if "From" parameter sent is 3 letters long
  test('Returns 400 status with "currencyCode is an Invalid Format!" message ', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USDA&to=DZD&amount=10');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("currencyCode is an Invalid Format!");
  });

  //Test to see if "To" parameter sent is 3 letters long
  test('Returns 400 status with "currencyCode is an Invalid Format!" message', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZDT&amount=10');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("currencyCode is an Invalid Format!");
  });


  //Test to see if 'From' parameter is in the list of accepted currencyCode
  test('Test to see if "From" parameter is in the list of accepted currencyCode', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USA&to=DZD&amount=10');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("currencyCode  is not supported.");
  });


  //Test to see if 'To' parameter is in the list of accepted currencyCode
  test('Test to see if "To" parameter is in the list of accepted currencyCode', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZA&amount=10');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("currencyCode  is not supported.");
  });


  //Test if amount is a number
  test('Test if amount is a number', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=DZD&amount=dfsw');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("is not a number.");
  });

  //Test if amount is 0 or less
  test('Test if amount is 0 or less', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=CAD&amount=0');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("needs to be greater than 0");
  });


  //Test to see if amount is an acceptable currency format
  test('Test to see if amount is an acceptable currency format', async () => {
    const response = await request(app).get('/api/currencyConverter?from=USD&to=CAD&amount=10.234');
    expect(response.status).toBe(400);
    expect(response.body.message).toContain("is not an acceptable currency format");
  });


});



describe('Test /api/locationToCurrency', () => {



});

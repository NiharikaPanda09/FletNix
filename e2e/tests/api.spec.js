const { test, expect } = require('@playwright/test');

const apiURL = 'http://127.0.0.1:3000/api';

test.describe('FletNix Backend API E2E Tests', () => {
  let uniqueEmail = `test_${Date.now()}@fletnix.com`;

  // Test 1: User Registration
  test('POST /auth/register - success', async ({ request }) => {
    const response = await request.post(`${apiURL}/auth/register`, {
      data: {
        email: uniqueEmail,
        password: 'Password123!',
        age: 20
      }
    });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('User registered successfully');
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(uniqueEmail);
    expect(body.user.age).toBe(20);
  });

  // Test 2: User Login
  test('POST /auth/login - success', async ({ request }) => {
    const response = await request.post(`${apiURL}/auth/login`, {
      data: {
        email: uniqueEmail,
        password: 'Password123!'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Login successful.');
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(uniqueEmail);
  });

  // Test 3: Paginated Shows List (Default)
  test('GET /shows - default pagination (15 items)', async ({ request }) => {
    const response = await request.get(`${apiURL}/shows`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.shows).toBeDefined();
    expect(Array.isArray(body.shows)).toBe(true);
    expect(body.shows.length).toBeLessThanOrEqual(15);
    expect(body.currentPage).toBe(1);
    expect(body.totalItems).toBeGreaterThan(0);
    expect(body.totalPages).toBeGreaterThan(0);
  });

  // Test 4: Age Restriction Enforcement (Under 18)
  test('GET /shows - under 18 cannot see R-rated content', async ({ request }) => {
    const response = await request.get(`${apiURL}/shows`, {
      params: {
        userAge: 15,
        limit: 100 // fetch a large chunk to increase chances of finding R-rated content if filters fail
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Check that none of the shows returned have a rating of "R"
    const rRatedShows = body.shows.filter(show => show.rating === 'R');
    expect(rRatedShows.length).toBe(0);
  });

  // Test 5: Age Restriction Bypass (Over 18)
  test('GET /shows - adult can see R-rated content', async ({ request }) => {
    // We search specifically for the word "Training" or check list for R-rated content
    // Let's search with userAge=21
    const response = await request.get(`${apiURL}/shows`, {
      params: {
        userAge: 21,
        limit: 100
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    
    // Check if there are R-rated shows available
    const rRatedShows = body.shows.filter(show => show.rating === 'R');
    // In netflix dataset, there are lots of R-rated shows (e.g. s48: Safe House, s50: Training Day).
    // So there should be some R-rated shows in the first 100 shows when age restriction is off.
    expect(rRatedShows.length).toBeGreaterThan(0);
  });

  // Test 6: Get Single Show details
  test('GET /shows/:id - fetch show by ID', async ({ request }) => {
    // First fetch some shows to get a valid ID
    const showsListResponse = await request.get(`${apiURL}/shows`);
    const listBody = await showsListResponse.json();
    const testShow = listBody.shows[0];

    // Fetch details by Mongo ObjectID
    const response = await request.get(`${apiURL}/shows/${testShow._id}`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe(testShow.title);
    expect(body.show_id).toBe(testShow.show_id);
    expect(body.description).toBe(testShow.description);
  });
});

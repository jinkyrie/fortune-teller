// Simple test to assign admin role
const CLERK_SECRET_KEY = 'sk_test_R1l5s0AhSz0SlwAQNMNa1aaTiCVJwzCoXsEJdfiszm';
const USER_ID = 'user_34QNamYoLPVb6Y3r9VSVfv7xdEl';

async function assignAdmin() {
  try {
    const response = await fetch(`https://api.clerk.dev/v1/users/${USER_ID}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: { role: 'admin' },
      }),
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

assignAdmin();

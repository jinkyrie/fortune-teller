const fetch = require('node-fetch');

async function assignAdminRole() {
  try {
    const response = await fetch('https://api.clerk.dev/v1/users/user_34QNamYoLPVb6Y3r9VSVfv7xdEl/metadata', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: { role: 'admin' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update user metadata:', errorText);
      return;
    }

    const result = await response.json();
    console.log('Successfully assigned admin role!');
    console.log('User metadata:', result);
  } catch (error) {
    console.error('Error assigning admin role:', error);
  }
}

assignAdminRole();

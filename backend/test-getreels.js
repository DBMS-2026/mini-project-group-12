const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/posts/reels?page=1&limit=20');
    console.log('Success:', res.data.success);
    console.log('Reels count:', res.data.data.reels.length);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
test();

import axios from 'axios';
async function test() {
  try {
    // I don't have the user's auth token, so I can't fetch it if it requires auth.
    // Wait, the backend URL is https://asl-api.up.railway.app/api/v1
    const res = await axios.get('https://asl-api.up.railway.app/api/v1/patient-dashboard/me');
    console.log(res.data);
  } catch (e) {
    console.log("Error:", e.response?.data || e.message);
  }
}
test();

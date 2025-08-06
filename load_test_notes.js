import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // 50 virtual users
  duration: '30s',
};

const BASE_URL = 'http://localhost:3000'; // or your deployed server
const TOKEN = 'PASTE_YOUR_GENERATED_JWT_HERE';
const GROUP_ID = '688e2d4b3f51ebc203e91dd8';

export default function () {
  // Test GET notes
  const res = http.get(`${BASE_URL}/api/notes/${GROUP_ID}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  check(res, {
    'GET /notes status is 200': (r) => r.status === 200,
  });

  // Optional: POST new note (only if you want to test note creation)
  const payload = JSON.stringify({
    title: 'Test Folder from k6',
    type: 'folder',
  });

  const postRes = http.post(`${BASE_URL}/api/notes/${GROUP_ID}`, payload, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  check(postRes, {
    'POST /notes status is 201': (r) => r.status === 201,
  });

  sleep(1); // pause for 1s between iterations
}

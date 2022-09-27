sed -i '' "s|http://localhost:3001|${ID_BASE_URL:-http://localhost:3001}|g" index.js
sed -i '' "s|http://localhost:3002|${BACKEND_BASE_URL:-http://localhost:3002}|g" index.js
python3 -u -m http.server 8080
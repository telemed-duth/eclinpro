export API_PORT=8081
export API_URL=http://$HOST:$API_PORT/api
export NODE_ENV=production
grunt build
PORT=$API_PORT npm start
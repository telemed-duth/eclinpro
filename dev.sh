export API_PORT=8081
export API_URL=http://$HOST:$API_PORT/api
export NODE_ENV=development
export MONGODB_URL="mongodb://localhost:27017/loopback-angular-admin"
# export INIT_USERS=true
grunt devbuild
PORT=$API_PORT npm start
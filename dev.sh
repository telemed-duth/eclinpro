export API_URL=http://$IP:$PORT/api
export NODE_ENV=development
export MMONGODB_URL="mongodb://localhost:27017/loopback-angular-admin"
export INIT_USERS=true
grunt devbuild
npm start
import io from 'socket.io-client';
console.log("socket here");
export default io.connect('http://localhost:8080');
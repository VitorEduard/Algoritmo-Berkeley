

const limitClients = 3;
let countClientsConnected = 0;
let internalClock = null;
let sumReturnTimeClients = 0;
let listClients = [];

module.exports = (io) => {

  io.on('connection', socket => {
    console.log('new connection', socket.id);

    socket.emit('send-id-client', socket.id);

    if (countClientsConnected != 0 && countClientsConnected == listClients.length) {
      listClients = [];
    }
    countClientsConnected += 1;
    
    if (countClientsConnected >= limitClients) {
      internalClock = new Date();
      console.log('send-clock-master', internalClock.getHours() + ':' + internalClock.getMinutes() + ':' + internalClock.getSeconds())
      io.emit('send-clock-master', internalClock.getTime()); 
    }

    socket.on('calc-clock-server', clientDifferenceClock => {
      console.log('calc-clock-server.clientDifferenceClock', socket.id, clientDifferenceClock)
      sumReturnTimeClients = clientDifferenceClock + sumReturnTimeClients;
      console.log('calc-clock-server.sumReturnTimeClients', socket.id, sumReturnTimeClients)
      listClients.push({'id': socket.id, socket, clientDifferenceClock});
      if (countClientsConnected == listClients.length) {
        const mediaTime = sumReturnTimeClients / (countClientsConnected + 1);
        const internalClockDate = new Date(internalClock.getTime() + mediaTime);
        console.log('calc-clock-server.internalClock', internalClockDate.getHours() + ':' + internalClockDate.getMinutes() + ':' + internalClockDate.getSeconds(), mediaTime)
        listClients.forEach(client => {
          const {clientDifferenceClock, socket, id} = client;
          const value = -clientDifferenceClock + mediaTime;
          console.log('calc-clock-server.value', id, value/1000)
          socket.emit('adjust-clock-client', value);          
        });
        listClients = [];
        sumReturnTimeClients = 0;
      }
    })

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
        countClientsConnected -= 1;
    });

  })
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


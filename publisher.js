const MQService = require('./MQService');
const queue = 'my-queue';
let count = 1;

// Publisher
MQService.getChannel(queue)
  .then((channel) => {
    setInterval(() => {
      channel.publish(`This is a test ${count}`);
      count++;
    }, 500)
  })
  .catch(console.error)

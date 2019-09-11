const MQService = require('./MQService');
const queue = 'my-queue';

MQService.getChannel(queue)
  .then((channel) => {
    console.log('worker 2');
    channel.consume()
  })
  .catch(console.error)

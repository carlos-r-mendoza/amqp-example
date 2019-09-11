const amqplib = require('amqplib');

class MQService {
  static async amqpConnect() {
    const connection = await amqplib.connect('amqp://localhost');
    return connection;
  }

  static async getChannel(queue) {
    const connection = await this.amqpConnect();
    const channel = await connection.createChannel();
    await channel.assertQueue(
      queue,
      { durable: true } // remember message if RabbitMQ server crashes
    );
    await channel.prefetch(1); // waits for 1 message to be acknowledge before processing next message

    return {
      publish(message) {
        return channel.sendToQueue(
          queue,
          Buffer.from(message),
          { persistent: true } // remember message if RabbitMQ server crashes
        );
      },
      consume() {
        return channel.consume(queue, (message) => {
          console.log('this is the message: ', message.content.toString());
          channel.ack(message);
        }, {
          // manual acknowledgment mode,
          // see https://www.rabbitmq.com/confirms.html for details
          noAck: false
        });
      }
    };
  }
}

module.exports = MQService;

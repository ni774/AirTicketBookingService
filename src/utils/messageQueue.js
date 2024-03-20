const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

const createChannel = async ()=> {
    try {
        const connection = await  amqplib.connect(MESSAGE_BROKER_URL);
        // console.log("done1");
        const channel = await connection.createChannel();
        // console.log("done2",EXCHANGE_NAME, channel);
        await channel.assertExchange(EXCHANGE_NAME, 'direct',  {
            durable: false
        });
        return channel;

    } catch (error) {
        console.log("error in message queue fn");
        throw error;
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue("REMINDER_NAME");
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, (msg) => {
          console.log("recieved data");
          console.log(msg.content.toString());
          channel.ack(msg);
        }); 
    } catch (error) {
        throw error;
    }
   
}

const publishMessage = async ( channel, binding_key, message) => {
    try {
        await channel.assertQueue('REMINDER_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
        // console.log(message);

    } catch (error) {
        throw error;
    }
        

}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}
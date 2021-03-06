import { app } from "./app";
import db from "./models";
import * as amqp from "amqplib/callback_api";

const PORT = process.env.PORT || 5000;
let mychannel: amqp.Channel;

db.sequelize
  .sync()
  .then(() => {
    amqp.connect(`${process.env.AMPQ_URI}`, (error0: any, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1: any, channel) => {
        if (error1) {
          throw error1;
        }
        mychannel = channel;
        app.listen(PORT, () =>
          console.log(`Server currently running on PORT: ${PORT}`)
        );
      });
      process.on("beforeExit", () => {
        connection.close();
      });
    });
  })
  .catch((err: any) => console.error("Unable to connect to the database", err));

export { mychannel };

import { app } from "./app";
import db from "./models";
import * as ampqlib from "amqplib/callback_api";

const PORT = process.env.PORT || 8000;
let mychannel;

db.sequelize
  .sync()
  .then(() => {
    ampqlib.connect(`${process.env.AMPQ_URI}`, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }
        mychannel = channel;
        app.listen(PORT, () =>
          console.log(`Server currently running on Port: ${PORT}`)
        );
        process.on("beforeExit", () => {
          connection.close();
        });
      });
    });
  })
  .catch(() => console.error("Unable to connect to the database"));

export { mychannel };

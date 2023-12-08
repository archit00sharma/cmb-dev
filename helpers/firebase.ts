import { setPriority } from "os";

var FCM = require('fcm-node');
var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
var fcm = new FCM("AAAA3Bentto:APA91bH_W4dY2C8hzD_NHdL3i5QJxTGfLGeS-e1w3UVcnPJ2t4N21Gw402ohHPFuVxm4axi6iP-tYWjTNrepVw6MwgVrZI1kUgQcUNUwfUlxx6VfQ4Wb2iadWRSofdyZy4JCoJnDqV83");

export default async function sendNotification(tokenArray, messsages, data, identify) {
    let messages = messsages
    let title = ""
    if (identify == "submit") {
        title = "Case Submited by field-executive"
    } else if (identify == "assigned") {
        title = "CMB"
    }
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        registration_ids: tokenArray,
        collapse_key: 'notify',
        notification: {
            title: `${title}`,
            body: `${messages}`
        },
        data: data,
        priority: "high",
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

var cron = require('node-cron');
const accountSid = 'ACab5c479a831c2ffb95d0ba67a1cbd317'; 
const authToken = '27823ac83bad84bc6449bb31eddb040a'; 
const client = require('twilio')(accountSid, authToken); 
var dateFormat = require('dateformat');
const axios = require('axios');

const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=721101&date='; //16-07-2021

console.log("Program started")

const sendMessage = data =>{
    client.messages 
      .create({ 
         body: data, 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+917001137041' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
}
const checkStatus = ()=>{
    var day=dateFormat(new Date(), "dd-mm-yyyy");
    const newurl = url + day
    // console.log(newurl)
    axios.get(newurl)
    .then(function (response) {
        // handle success
        let availability = 0
        response.data.centers.forEach(center => {
            center.sessions.forEach(session =>{
                if(session.available_capacity_dose1>0){
                    sendMessage("Available "+session.available_capacity_dose1 + " at "+ center.name)
                    availability ++
                }
            })
        });
        if(availability==0) {
            sendMessage("Not Available")
        }
        // logger.info(JSON.stringify(response.data));
        // console.log(JSON.stringify(response.data));
        // console.log("Avail = "+ availability);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    // sendMessage("new message from func")
}


cron.schedule('*/30 * * * *', () => {
    checkStatus()
    console.log('running a task every thirty minutes');
});

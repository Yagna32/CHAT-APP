const axios = require('axios')
const fs = require('fs');

// Replace these placeholders with your actual values
const apikey = '1H5xyfpXBmL50-Ez4fCcnvfmc-h-ouPuEc8MCwfv8g_f';
const url = 'https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/e62e0ae9-dc4a-4e0e-b87a-5925baec8d5f';
const textToSynthesize = 'hello world';

// Construct the request headers and data
const headers = {
  'Content-Type': 'application/json',
  Accept: 'audio/wav'
};
const data = {
  text: textToSynthesize
};

// Make the POST request
axios({
  method: 'post',
  url: `${url}/v1/synthesize?voice=en-US_MichaelV3Voice`,
  headers: headers,
  data: data,
  auth: {
    username: 'apikey',
    password: apikey
  },
  responseType: 'stream'
})
  .then(response => {
    // Save the audio file
    response.data.pipe(fs.createWriteStream('hello_world.wav'));
    console.log('Audio file saved successfully.');
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

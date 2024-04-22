
const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $audio = document.getElementById('audioPlayer')
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username , room } = Qs.parse(location.search , {ignoreQueryPrefix : true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

async function convertToSpeech(description) {
    try {
      const url = 'https://api.au-syd.text-to-speech.watson.cloud.ibm.com/instances/e62e0ae9-dc4a-4e0e-b87a-5925baec8d5f';
      const apiKey = '1H5xyfpXBmL50-Ez4fCcnvfmc-h-ouPuEc8MCwfv8g_f'; // Replace with your actual API key
  
      const response = await fetch(`${url}/v1/synthesize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`apikey:${apiKey}`)}`
        },
        body: JSON.stringify({
          text: description,
          voice: 'en-US_AllisonV3Voice', // Choose the voice (you can change this)
          accept: 'audio/wav'
        })
      });
  
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
  
      // Play the synthesized speech
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  }

socket.on('message' , (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate , {
        username: message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm A'),
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    const messageElement = document.querySelector('.message:last-child');
    const buttonElement = messageElement.querySelector('.play-button'); // Assuming there's a play button in your message template

    if (buttonElement) {
        buttonElement.addEventListener('click', () => {
            // Handle button click event
            convertToSpeech(message.text)
        });
    }
    autoscroll()
})

socket.on('locationMessage' , (message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate , {
        username : message.username,
        url : message.url,
        createdAt : moment(message.createdAt).format('h:mm A'),
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoscroll()
})

socket.on('roomData' , ({room ,  users })=>{
    const html = Mustache.render(sidebarTemplate , {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit' , (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled' , 'disabled')

    const message = e.target.elements.message.value 

    socket.emit('sendMessage' , message , (error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message was delivered!')
    })
})

$sendLocationButton.addEventListener('click' , ()=>{
    
    if(!navigator.geolocation){
        return alert('Geolocation has not been sported on your browser')
    }
    $sendLocationButton.setAttribute('disabled' , 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation' , {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        } , ()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.emit('join' , { username , room } , (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})
const WS_URI = 'ws://localhost:8080'
const REQUEST_TYPE_CANDIDATE = 'CANDIDATE'
const REQUEST_TYPE_OFFER = 'OFFER'
const REQUEST_TYPE_ANSWER = 'ANSWER'
const DEVICE_NAME = 'CAMERA'

const wsSocket = new WebSocket(WS_URI)

wsSocket.onopen = (event) => {
    console.log('Connected to the signaling server')
}

wsSocket.onclose = (event) => {
    console.log('Signaling server connection has been closed')
}

wsSocket.onerror = (event) => {
    console.error(`Signaling server error occures: "${event}"`)
}

wsSocket.onmessage = ({ data }) => {
    switch (data.type) {
        case REQUEST_TYPE_ANSWER: return handleAnswer(data)
        default: console.log(`Unknown type of message: ${JSON.stringify(data, true, 2)}`)
    }
}

const rootElement = document.getElementById('root')

const handleClose = () => {
    rtcpConnection.close()
    rtcpConnection.onicecandidate = null
    rtcpConnection.onaddstream = null
}

const handleIceCandidate = (event) => {
    const { candidate } = event

    if (!candidate) {
        return
    }

    wsSocket.send({
        type: REQUEST_TYPE_CANDIDATE,
        candidate
    })
}

const handleAnswer = answer => {
    rtcpConnection.setRemoteDescription(new RTCSessionDescription(answer))
}

navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(stream => {
        rtcpConnection = new RTCPeerConnection({})

        rtcpConnection.onicecandidate = handleIceCandidate

        rtcpConnection.addStream(stream)

        rtcpConnection.createOffer()
          .then((offer) => rtcpConnection.setLocalDescription(offer))
          .then(() => {
            wsSocket.send({
              type: REQUEST_TYPE_OFFER,
              data: {
                  name: DEVICE_NAME,
                  sdp: rtcpConnection.localDescription
              }
            })
          })
          .catch((error) => {
            console.error(`Error occures while creating offer: "${error}"`)
          })
    })
    .catch(error => console.error(error))
const WS_ADDRESS = 'ws://localhost:8080'

const wsSocket = new WebSocket(WS_ADDRESS)

wsSocket.onmessage = function ({ data }) {
    
}

const rootElement = document.getElementById('root')

navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then(stream => {
        rtcpConnection = new RTCPeerConnection({})

        rtcpConnection.onicecandidate = (event) => {
            const { candidate } = event

            if (!candidate) {
                return
            }

            wsSocket.send({
                type: 'candidate',
                candidate
            })
        }

        rtcpConnection.addStream(stream)
    })
    .catch(error => console.error(error))
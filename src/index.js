import webRtc from './webRtc.js'
import {
    WS_URI,
    API_TYPE_CANDIDATE,
    API_TYPE_OFFER,
    API_TYPE_ANSWER,
    DEVICE_NAME
} from './constants.js'

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
        case API_TYPE_OFFER: {
            return
        }
        case API_TYPE_ANSWER: {
            return
        }
        default: console.log(`Unknown type of message: ${JSON.stringify(data, true, 2)}`)
    }
}

const rtcChannel = webRtc({
    onIceCandidate (candidate) {
        wsSocket.send({ type: API_TYPE_CANDIDATE, candidate })
    },

    // onOffer (answer) {
    //     wsSocket.send({ type: REQUEST_TYPE_ANSWER, answer })
    // },

    // onOfferCreate (sdp) {
    //     wsSocket.send({
    //         type: REQUEST_TYPE_OFFER,
    //         data: { name: DEVICE_NAME, sdp }
    //     })
    // }
})

rtcChannel
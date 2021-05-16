const { navigator } = window

async function initialize({
    userMediaOptions = {
        audio: true,
        video: true
    },
    onIceCandidate
}) {
    const handleIceCandidate = (event) => {
        const { candidate } = event
    
        if (!candidate) {
            return
        }
    
        onIceCandidate(candidate)
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia(userMediaOptions)
        const rtcpConnection = new RTCPeerConnection()

        rtcpConnection.onicecandidate = handleIceCandidate
        rtcpConnection.addStream(stream)

        return {
            close () {
                rtcpConnection.close()
                rtcpConnection.onicecandidate = null
                rtcpConnection.onaddstream = null
            },
    
            async createOffer () {
                try {
                    const offer = await rtcpConnection.createOffer()
            
                    rtcpConnection.setLocalDescription(offer)
            
                    return rtcpConnection.localDescription
                } catch (error) {
                    console.error(`Error occures while creating offer: "${error}"`)
                }
            },
    
            async createAnswer () {
                try {
                    const answer = await rtcpConnection.createAnswer()
            
                    rtcpConnection.setLocalDescription(answer)
            
                    return answer
                } catch (error) {
                    console.error(`Error occures while creating offer: "${error}"`)
                }
            },

            setOffer (offer) {
                rtcpConnection.setRemoteDescription(new RTCSessionDescription(offer))
            },

            setAnswer (answer) {
                rtcpConnection.setRemoteDescription(new RTCSessionDescription(answer))
            }
        }
    } catch (error) {
        console.error(error)
    }
}

export default initialize
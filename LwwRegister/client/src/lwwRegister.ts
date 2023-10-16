import { WebSocket } from 'ws';
import { Client } from '@stomp/stompjs';

const user = document.getElementById("user") as HTMLInputElement;
const userSelect = document.getElementById("userSelect") as HTMLInputElement;
const msg = document.getElementById("msg") as HTMLInputElement;
const stopConnection = document.getElementById("stopConnection")  as HTMLInputElement
const startConnection = document.getElementById("startConnection") as HTMLInputElement

console.log("페이지 열림")
let connectionState : Boolean = false;
class LWWRegister<T> {
    readonly id: string;
    state: {peer: string, timestamp: number, value: T};


    get value() {
        return this.state.value;
    }

    constructor(id: string, state: {peer :string, timestamp: number, value: T}) {
        this.id = id;
        this.state = state;
    }

    set(value: T) {
        // set the peer ID to the local ID, increment the local timestamp by 1 and set the value
        this.state = {peer : this.id, timestamp : this.state.timestamp + 1, value};
    }


    merge(state: {peer: string, timestamp: number, value: T}) {
        const remotePeer = state.peer;
        const remoteTimestamp = state.timestamp;
        const localPeer = this.state.peer;
        const localTimestamp = this.state.timestamp;

        console.log("local : " + localTimestamp + " remote : " + remoteTimestamp)
        // if the local timestamp is greater than the remote timestamp, discard the incoming value
        if (localTimestamp > remoteTimestamp){
            console.log(`localTimestamp > remoteTimestamp`)
            return;
        }

        // if the timestamps are the same but the local peer ID is greater than the remote peer ID, discard the incoming value
        if (localTimestamp === remoteTimestamp && localPeer > remotePeer){
            console.log(`localTimestamp = remoteTimestamp & localPeer > remotePeer`)
            return;
        }
        // otherwise, overwrite the local state with the remote state
        this.state = state;
        console.log("merge")
        console.log("state : "+ JSON.stringify(this.state))
        console.log("this.state : " + JSON.stringify(this.state))
        msg.value = JSON.stringify(this.state.value).replace(/\"/gi, "")
    }
}


let lwwRegister : LWWRegister<String>


let client: Client;
userSelect.addEventListener("click",()=>{
    console.log("유저 결정")
    lwwRegister = new LWWRegister<String>(user?.value,{peer : user?.value || '', timestamp : 0, value : msg.value || ''});

    client = new Client({
        brokerURL: 'ws://127.0.0.1:8080/ws/doc',
        onConnect: () => {

            client.subscribe('/topic/room', message => {
                    console.log(`Who's Enter: ${message.body}`)
                    if(lwwRegister.id === message.body){
                        return;
                    }
                    let state = {
                        "peer" : user.value || '',
                        "timestamp" : lwwRegister.state.timestamp,
                        "value" : msg.value,
                    };

                    client.publish({destination:'/app/chat.send', body: JSON.stringify(state) });

                }
            );
            client.subscribe('/topic/doc', message => {

                const data = JSON.parse(message.body);
                if (data.peer === lwwRegister.id) {
                    return;
                }

                lwwRegister.merge(data);

            })

            //peer: string, timestamp: number, value: T
            connectionState=true;
                client.publish({ destination: '/app/chat.enter', headers : {login : user.value} ,body: user.value || '' });
        },
    });
    client.activate();

    stopConnection.addEventListener('click',()=>{
        client.deactivate();
        connectionState=false;
    })
    startConnection.addEventListener('click',()=>{
        connectionState=true;
        client.activate();
    })

    msg.addEventListener('keyup',async (event) => {
        // event.preventDefault()
        console.log(msg.value)
        if (!event.ctrlKey) {
            if (event.keyCode > 64 && event.keyCode < 91 || event.keyCode === 8) {
                await lwwRegister.set(msg.value);
                if(!connectionState) return;

                client.publish({destination:'/app/chat.send', body: JSON.stringify(lwwRegister.state) });
            }
        }})
})




// Lamport 논리 시계 클래스
class LamportClock {
  constructor() {
    this.time = 0;
  }

  tick() {
    this.time += 1;
  }

  update(remoteTime) {
    this.time = Math.max(this.time, remoteTime) + 1;
  }

  getTime() {
    return this.time;
  }
}

let input = document.getElementById("msg");
let user = document.getElementById("user");
let repeat_btn = document.getElementById("repeat_button");
let stop_btn = document.getElementById("stop_button");
let enter_btn = document.getElementById("enter_button")


function onConnected() {
  stompClient.subscribe("/topic/doc", responseMessage, { ack: "client" }); // subscribe 파라미터 : 1. 구독할 토픽 url 2. 콜백메소드
  console.log("연결");
}
function connectError() {
  alert("오류");
}
function disConnected() {
  console.log("연결이 종료되었습니다.");
}

  // Lamport 논리 시계 인스턴스 생성
  const lamportClock = new LamportClock();
  let socket = new SockJS("/ws/doc");

  let stompClient = Stomp.over(socket);

  const performConcurrencyControl = (serverTimestamp) => {
    if (serverTimestamp > lamportClock) {
      lamportClock.time = serverTimestamp + 1;
      console.log("SERVER TIME BIGGER~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    } else {
      lamportClock.time++;
      console.log("TIME SAME ====================================")
    }
  };
  // 요소 추가 함수
  function addElement(element, index) {
    const timestamp = lamportClock.getTime();
    lamportClock.tick();

    // 서버로 요소 추가 작업 전송
    const message = {
      id : user.value,
      element: element,
      type : "ADD",
      index : index,
      timestamp: timestamp,
    };

    stompClient.send('/app/add', {}, JSON.stringify(message));
  }

// 요소 삭제 함수
  function removeElement(index) {
    const timestamp = lamportClock.getTime();
    lamportClock.tick();

    // 서버로 요소 삭제 작업 전송
    const message = {
      id : user.value,
      type: 'REMOVE',
      index :index,
      timestamp: timestamp
    };

    stompClient.send('/app/remove', {}, JSON.stringify(message));
  }

// 요소 추가 처리 함수
  function handleAddElement(element,index) {
    // 요소 추가 로직 구현
    console.log('Element added:', element);
    let original = input.value;
    let front = original.substring(0, index);
    let end = original.substring(index, original.length);
    input.value = front + String.fromCharCode(element) + end;

    input.selectionStart = index+1
    input.selectionEnd = index+1
  }

// 요소 삭제 처리 함수
  function handleRemoveElement(index) {
    // 요소 삭제 로직 구현
    console.log('Element removed_index:', index);
    let original = input.value;
    let front = original.substring(0, index-1);
    let end = original.substring(index , original.length); //아마 indexing 오류 있지않을까
    input.value = front + end;

    input.selectionStart = index-1
    input.selectionEnd = index-1
  }



  function sendMessage(element, index, command) {
    if(command==='ADD'){
      addElement(element,index)
    }else{
      removeElement(index)
    }
    console.log("보냄");
  }

  //onKeyDown(keycode값),  onKeyPress(ASCII값) :  키를누르면 이벤트발생후 문자 입력, onKeyUp : 키를 누르면 문자입력후 이벤트발생
  //keydown : 누르는 순간 발생 keyup : 눌렀다 떼는 순간 발생

  input.addEventListener("keydown", (event) => {

    event.preventDefault()

    if (!event.ctrlKey) {
      if (event.keyCode > 64 && event.keyCode < 91) {
        sendMessage(event.keyCode, event.target.selectionStart, "ADD");
      } else if (event.keyCode === 8) {
        sendMessage(event.keyCode, event.target.selectionStart, "REMOVE");
      }
    }
  });





  function responseMessage(response) {
    // 메시지 수신 시 실행되는 콜백 함수
    const message = JSON.parse(response.body);
      // 메시지 처리
      // 서버로부터 받은 Lamport 시계 값과 비교하여 동시성 제어 수행
      performConcurrencyControl(message.timestamp);

      switch (message.type) {
        case 'ADD':
          handleAddElement(message.element,message.index);
          break;
        case 'REMOVE':
          handleRemoveElement(message.index);
          break;
        default:
          console.log('Unknown message type: ' + message.type);
      }
    response.ack();
  }


  let interval;
  let possible = "abcdefghijklmnopqrstuvwxyz";
  let random_alph = "";
  repeat_btn.addEventListener("click", () => {
    interval = setInterval(() => {
      random_alph = Math.floor(Math.random() * possible.length);
      sendMessage(65 + random_alph, input.value.length, "ADD");
    }, 500);
  });

  stop_btn.addEventListener("click", () => {
    clearInterval(interval);
  });
  enter_btn.addEventListener('click',()=>{

    stompClient.connect({}, onConnected, connectError);


    console.log("asd")
  })


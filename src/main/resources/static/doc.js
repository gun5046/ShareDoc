class Queue {
	constructor() {
		this._arr = [];
		this.top=null;
	}
	enqueue(item) {
		this._arr.push(item);
	}
	dequeue() {
		return this._arr.shift();
	}
}

const waiting_queue = new Queue();
let waiting_time = false;

let command = {
	command : "",
	type : "",
	value : "",
	index : "",
	user : ""
};
	
let input= document.getElementById('msg');
let user = document.getElementById('user');
let repeat_btn = document.getElementById('repeat_button');
let stop_btn = document.getElementById('stop_button');

window.onload = function() {


	let socket = new SockJS("/ws/doc");

	let stompClient = Stomp.over(socket);
	stompClient.connect({}, onConnected, connectError);

	function onConnected() {
		stompClient.subscribe('/topic/doc', responseMessage); // subscribe 파라미터 : 1. 구독할 토픽 url 2. 콜백메소드
		console.log("연결");
	}
        
        
		//onKeyDown(keycode값),  onKeyPress(ASCII값) :  키를누르면 이벤트발생후 문자 입력, onKeyUp : 키를 누르면 문자입력후 이벤트발생
		//keydown : 누르는 순간 발생 keyup : 눌렀다 떼는 순간 발생

	function sendMessage(k,i,c){
		command.command = c;
		command.type = "SEND";
		command.value = k;
		command.index = i;
		command.user = user.value;
		while(waiting_time===true) setTimeout(console.log("wating_queue"),100);
		waiting_queue.enqueue(command);

		let cmdObject= JSON.stringify(command);

		stompClient.send("/app/chat.send", {"Type" : "Send"}, cmdObject);
		console.log("보냄");

	}
	input.addEventListener('keydown',(event)=>{
		console.log(event.target.selectionStart);
		if(!event.ctrlKey) {
			if (event.keyCode > 64 && event.keyCode < 91) {
				sendMessage(event.keyCode, event.target.selectionStart,"INSERT");
			}
			else if (event.keyCode ===8){
				sendMessage(event.keyCode,event.target.selectionStart,"DELETE");
			}
		}
	});
	let interval;
	let possible = "abcdefghijklmnopqrstuvwxyz";
	let random_alph = '';
	repeat_btn.addEventListener('click',()=>{
			interval = setInterval(()=>{
				let org = input.value;
				random_alph = Math.floor(Math.random() * possible.length);
				input.value = org + possible.charAt(Math.floor(random_alph));
				sendMessage(65+random_alph, input.value.length, "INSERT");
			},500);

	})

	stop_btn.addEventListener('click',()=>{
		clearInterval(interval);
	})

	function connectError() {
		alert("오류");
	}
	function disConnected() {
		console.log("연결이 종료되었습니다.");
	}
	function responseMessage(response) {
		let data = JSON.parse(response.body);

		waiting_time = true;
		if (data.user === user.value) {
			console.log("내꺼");
			waiting_queue.dequeue();
		} else {
			let length = waiting_queue._arr.length;
			for (i = 0; i < length; i++) {
				if (waiting_queue._arr[0].index <= data.index) {
					if (waiting_queue._arr[0].command === 'INSERT') {
						data.index++;
					} else {
						data.index--;
					}
				}
				waiting_queue.enqueue(waiting_queue.dequeue()); //enqueue가먼저? 삭제가먼저?
			}
			waiting_queue.dequeue();
			let original = input.value;
			let command_index = data.index;
			let front = ""
			let end = ""
			if (data.command === 'INSERT') {
				front = original.substring(0, command_index);
				end = original.substring(command_index, original.length);
				input.value = front + data.value + end;
			} else {
				front = original.substring(0, command_index-1);
				end = original.substring(command_index , original.length); //아마 indexing 오류 있지않을까
				input.value = front + end;
			}
		}
		waiting_time = false;
	}
}




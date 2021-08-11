import socket from 'socket.io-client';

export default class Socket {
  //baseURL받아와서 ,getAccessToken 토큰을 받을수 있는 콜백 함수를 받아서. 
  constructor(baseURL, getAccessToken) {
    //잘못된 소스 query 소겥아이디 브라우져에 지저분하게 노출 될뿐아니라 
    // const io = socket(this.baseURL, {
    //   query:{ token: this.getAccessToken()},
    // });
    
    //소겥을 만들때.
    this.io = socket(baseURL, {
      // 해당부분은 상당히 중요하다. 
      //소겥을 전달할때는 다양한 방법이 있지만. 소겥에 있는 auth 라는 필드를 이용해서. 전달.
      //getAccessToken() 함수를 통해서 token을 전달한다. 
      //auth 안에 있는 socket 공식 싸이트 기준 
      auth: (cb) => cb({ token: getAccessToken() }),
    });
    // 소겥을 만들때 에러가 발생할경우 에러처리 
    this.io.on('connect_error', (err) => {
      console.log('socket error', err.message);
    });
  }

  //사용하고 싶은 사람이 onSync (event ==> 주재에 대해서 이야기를 하고 / callback==> 그 이벤트가 발생하면 뭘 하고싶은지 콜백을 전달하면  )
  onSync(event, callback) {

    //io까지 연결 돼지 않았다면 
    if (!this.io.connected) {
      //연결은 한다. (연결돼지 않았을때만 연결 한다.ㅏ )
      this.io.connect();
      console.log(this.io.id());
    }
    //이벤트에 대해서 event==>(message) 위에서 전달받은 콜백 함수를 호출해줄꺼다. 
    this.io.on(event, (message) => callback(message));
    //io에 대해서 해당 이벤트에 대해서 더이상 듣지 않도록 off return 으로 전달해줄거다. 
    //사용하는 사람이 return 된 callback 함수를 가지고 있다가 더이상 듣고싶지 않을때 해당함수를 호출 하면 된다. 

    return () => this.io.off(event);
  }
}

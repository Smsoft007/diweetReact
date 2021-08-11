export default class TweetService {
  //socket을 생성자 에서 받아서  
  constructor(http, tokenStorage, socket) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.socket = socket;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    return this.http.fetch(`/tweets${query}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async postTweet(text) {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text, username: 'ellie', name: 'Ellie' }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }

  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  //사용하는 사람이 onSync 새로운 tweets이 생겼을때 어떤일을 하고싶은지 
  //하고싶은 일을 callback 으로 전달 해주면 socket.onSync를 이용해서 
  // 해당하는 tweets 을 계속 적으로 듣고 있다. 
  // onSyce ===> callback 을 연결하는 함수이다. 
  onSync(callback) {
    return this.socket.onSync('tweets', callback);
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import TokenStorage from './db/token';
import Socket from './network/socket';


const baseURL = process.env.REACT_APP_BASE_URL;
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL);
const authErrorEventBus = new AuthErrorEventBus();
const authService = new AuthService(httpClient, tokenStorage);
//socketClient 만들어서 tweetService서비스에 전달해준다. 
//Socket 전달하는것은 baseURL뿐만아니라. () => tokenStorage.getToken() 콜백함수를 하나 전달한다.
//() => tokenStorage.getToken()서버에 토큰을 보내야하는데 , 업데이트된 최근에 토큰을 받아갈수있도록 tokenStorage있는 getToken  잃어갈수있는 콜백함수를 전달. 해주었다. 
//
const socketClient = new Socket(baseURL, () => tokenStorage.getToken());
const tweetService = new TweetService(httpClient, tokenStorage, socketClient);



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

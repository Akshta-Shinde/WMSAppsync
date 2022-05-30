import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import Amplify from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: 'ap-south-1',
        userPoolId: 'ap-south-1_Yh2lXizLX',
        identityPoolId: 'ap-south-1:94b24525-38de-43ee-8cb3-7ba3807c4235',
        userPoolWebClientId: '596p20usl5avibctbotico6a6u',
        mandatorySignIn: false
    }
});

const myAppConfig = {
  'aws_appsync_graphqlEndpoint': 'https://kbrcur5hjjburcz52fgp52lbmm.appsync-api.ap-south-1.amazonaws.com/graphql',
  'aws_appsync_region': 'ap-south-1',
  'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS'
}

Amplify.configure(myAppConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


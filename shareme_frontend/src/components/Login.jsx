import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import jwt_decode from 'jwt-decode';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    var decode = jwt_decode(response.credential);
    const name      = decode.name;
    const aud       = decode.aud;
    const googleId  = aud.split('.')[0];
    const imageUrl  = decode.picture;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl
    }
    localStorage.setItem('user',JSON.stringify(doc));
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
            <div className="shadow-2xl">
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
                <GoogleLogin 
                  render={(renderProps)=>(
                    <button className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                    type="button"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    >
                      <FcGoogle className="mr-4" /> Sign In With Google
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy="single_host_origin"
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
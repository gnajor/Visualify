import { Logo } from "../../components/logo/logo.js";
import { onLoginButton } from "./shared.js";

export function renderHomePage(parent, onDemo){
    parent.innerHTML = `<div id="home-page">
                            <div id="circle-box">
                                <div id="circle-one" class="circle"></div>
                                <div id="circle-two" class="circle"></div>
                                <div id="circle-three" class="circle"></div>
                                <div id="circle-four" class="circle"></div>
                                <div id="circle-five" class="circle"></div>
                            </div>
                            <div id="logo"></div>
                            <div id="button-container">
                                <button id="login">
                                    <img src="media/icons/spotify-logo.svg" alt="spotify logo">
                                    <span>Login with Spotify</span>    
                                </button>
                                <button id="demo">Try Demo</button>
                            </div>
                        </div>`;

    const loginButton = parent.querySelector("button#login");
    const demoButton = parent.querySelector("button#demo");
    const logoContainer = parent.querySelector("#logo");
    const logo = new Logo(logoContainer, 500, 100, 80, 350);
    logo.initLogo();
    logo.initAnimation();
    loginButton.addEventListener("click", onLoginButton);
    demoButton.addEventListener("click", onDemo);
}
import { Logo } from "../../components/logo/logo.js";
import { onLoginButton } from "./shared.js";

export function renderPhoneHomePage(parent){
    parent.innerHTML = `<div id="home-page">
                            <div class="circle-border" id="top">
                                <div class="circle-box">
                                    <div class="green-circle"></div>
                                </div>
                            </div>
                            <div id="logo"></div>
                            <div class="circle-border" id="bottom">
                                <div class="circle-box">
                                    <button id="login">
                                        <img src="media/icons/spotify-logo.svg" alt="spotify logo">
                                        <span>Login with Spotify</span>    
                                    </button>
                                    <div class="green-circle"></div>
                                </div>
                            </div>
                        </div>`;

    const loginButton = parent.querySelector("button#login");
    const logoContainer = parent.querySelector("#logo");
    const logo = new Logo(logoContainer, 240, 80, 80, 350);
    logo.initLogo();
    logo.initAnimation();
    loginButton.addEventListener("click", onLoginButton);
}
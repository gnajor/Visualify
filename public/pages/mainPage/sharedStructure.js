export function updateCurrentMainPage(width, height, pageIndex){
    const main = document.querySelector("main");
    main.style.transform = `translate(${width}, ${height})`;

    const switchInstance = Switch.getCurrentSwitchById(pageIndex);
    
    if(switchInstance)Switch.updateSwitch(switchInstance);
}
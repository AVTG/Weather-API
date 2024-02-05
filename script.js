const API_KEY = "b7eb96c085f27521c896f3df7486b8e8" ;
const userTab = document.querySelector("[data-yourWeather]")
const searchTab = document.querySelector("[data-customWeather]") ;

const userContainer = document.querySelector("[data-weatherInfoDisplay]") ;
const searchContainer = document.querySelector("[data-searchForm]") ;
const grantAccessContainer = document.querySelector("[data-accessContainer]") ;
const loadingScreenDisplay = document.querySelector("[data-loadingScreen]") ;


let old_tab = userTab ;
old_tab.classList.add("current-tab") ;
getSessionStorage();


function switchTab(newTab){
    if(newTab != old_tab){
        old_tab.classList.remove("current-tab") ;
        old_tab = newTab
        old_tab.classList.add("current-tab") ;

        //not on search tab
        if(!searchContainer.classList.contains("active")){
            searchContainer.classList.add("active") ;
            userContainer.classList.remove("active") ;
            grantAccessContainer.classList.remove("active") ;
        }

        //want to go to user tab
        else{
            searchContainer.classList.remove("active") ;
            getSessionStorage() ;
            userContainer.classList.add("active") ;

        }
    }
}


//pass clicked tab
userTab.addEventListener('click' , () => {
    switchTab(userTab) ;
}) ;


//pass clicked tab
searchTab.addEventListener('click' , () => {
    switchTab(searchTab) ;
}) ;





function getSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-coordinates") ;

    if(!localCordinates){
        grantAccessContainer.classList.add("active") ;
    }

    else{
        const coordinates =  JSON.parse(localCordinates) ;
        fetchWeatherInfo(coordinates) ;
    }
}


async function fetchWeatherInfo (coordinates){
    const {lat , lon} = coordinates ;

    grantAccessContainer.classList.remove("active");
    loadingScreenDisplay.classList.add("active") ;
    
    
    try{
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`) ;
        
        const data = await response.json() ;
        
        searchContainer.classList.remove("active") ;
        renderWeatherInfo(data) ;
        loadingScreenDisplay.classList.remove("active") ;
        userContainer.classList.add("active") ;
        
    }
    
    catch(e){
        loadingScreenDisplay.classList.remove("active") ;
        grantAccessContainer.classList.add("active");
        alert(e) ;
        return ;
    }
}



function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = `${weatherInfo?.name}`;
    countryIcon.src = `https://flagcdn.com/40x30/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    let descrip = weatherInfo?.weather?.[0]?.description 
    desc.innerText = descrip.charAt(0).toUpperCase() +descrip.slice(1);  ;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition) ;
    }

    else{
        alert('No Geolocation available') ;
    }
}


function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude ,
        lon : position.coords.longitude ,
    };

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates) ) ;

    fetchWeatherInfo(userCoordinates) ;
}

const grantAccessButton = document.querySelector("[data-grantAccess]") ;

grantAccessButton.addEventListener("click" , () => {
    getLocation() ;
}) ;


const searchInput = document.querySelector("[data-searchInput]") ;
searchContainer.addEventListener("submit" , e => {
    e.preventDefault() ;
    let cityName = `${searchInput.value}` ;

    if(cityName === ""){
        return ;
    }

    else{
        fetchSearchWeather(cityName) ;
    }
}) ;


async function fetchSearchWeather(cityName){
    loadingScreenDisplay.classList.add("active") ;
    userContainer.classList.remove("active") ;
    grantAccessContainer.classList.remove("active") ;

    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`) ;

        const data = await response.json() ;
        renderWeatherInfo(data) ;

        loadingScreenDisplay.classList.remove("active") ;
        userContainer.classList.add("active") ;
    }
    
    catch(err){
        alert('City not in our Database') ;
        loadingScreenDisplay.classList.remove("active") ;

    }
}


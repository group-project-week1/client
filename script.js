function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
      url: 'http://localhost:3000/user/google-sign-in',
      type: 'POST',
      data: { id_token }
  })
  .done(function(user) {
      localStorage.setItem("token", user.token)
      $("#tombol-login").hide();
      renderUser(user)
      renderForm()
  })
  .catch(err => {
      console.log(err)
  })
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token');
    initial();
    $("#tombol-login").show();
  });
}

function initial(){
  $("#user-signin").children().remove()
  $("#form-container").children().remove()
  $("#weather-container").children().remove()
  $("#weather-container").append(`
    <div id="hero-container">
      <div id="hero">
        <h1>Weather App</h1>
        <p>Get weather data with visual images</p>
      </div>
    </div>
  `)
}


function renderUser(userData) {
  $("#user-signin").children().remove()
  $("#user-signin").append(`
    <img src = "${userData.picture}">
    <p>Hello <b>${userData.name}</b> </p>
    <a href="#" onclick="signOut()">Logout</a>
  `)
}

function renderForm() {
  $("#form-container").append(`
    <form id="search-box">
      <input type="text" id="city" placeholder="Search city..." autocomplete = "off">
      <button type="submit">Submit</button>
    </form>
  `)

  $('#search-box').submit(function(event) {
    $("#loading").show();
    event.preventDefault()
    let city = $('#city').val()
    $.ajax({
      url: `http://localhost:3000/weathers/${city}`,
      type:'GET'
    })
    .done((result) => {
      if(result.message === "city not found"){
        $("#loading").hide();
        alert("City not found")
      }else{
        $("#loading").hide();
        renderWeather(result)
      }
    })
    .catch(err => {
      // console.log(err)
    })
  })
}

function renderWeather(data) {
  console.log(data)
  $("body").css("background", `url(${data.urlCity})`);
  $("body").css("background-repeat", "no-repeat");
  $("body").css("background-size", "cover");
  $("#weather-container").children().remove()
  $("#weather-container").append(`
    <div id="content">
      <div id="weather">
        <img id = "weather-image" src="${data.image}">
        <h1>${data.name}, ${data.sys.country}</h1>
        <span id="temperature">
          <span>${data.temp}</span>
          <span>o</span>
          <span>C</span>
        </span>
        <p>${data.weather[0].description}</p>

        <div id="show-detail">
          show-detail
        </div>
      </div>

      <div id="air-quality" style="background-color: ${data.pollution.status.color}">
        <h2>AQI (Air Quality Index) : ${data.pollution.aqi}</h2>
        <h3>Status : ${data.pollution.status.status}</h3>
        <p>${data.pollution.status.health_implications}</p>
      </div>
    </div>

    <div id="detail-container">
    <div id="detail">
      <div id="detail-close">
        x
      </div>
      <div id="detail-content">
        <table border="0">
          <tr>
            <th>Name</th>
            <td>${data.name}</td>
          </tr>
          <tr>
            <th>Country</th>
            <td>${data.sys.country}</td>
          </tr>
          <tr>
            <th>Wind</th>
            <td>Deg : ${data.wind.deg}, Speed : ${data.wind.speed}</td>
          </tr>
          <tr>
            <th>Coordinat</th>
            <td>Longitude : ${data.coord.lon}, Latitude : ${data.coord.lat}</td>
          </tr>
        </table>

        <div id="map">
          <iframe width="100%" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDp1IJH4yHkZYPqJAQv1uiryXRw_Di8mCY&q=${data.name}"></iframe>
        </div>
      </div>
    </div>
  </div>
  `)
  $('#show-detail').click(function() {
    $('#detail-container').show("fast")
  })

  $('#detail-close').click(function() {
    $('#detail-container').hide(200);
  })
}
initial();
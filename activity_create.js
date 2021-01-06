function setActivityDiv(act_id) {
  url_div = document.getElementById("activity_url");
  url_div.innerHTML = "Activity URL: " + API_URL + "/" + act_id;
}

window.addEventListener( "load", function () {
    function sendData() {
    
        // make post request
        fetch(API_URL + "/create_activity", {
            method: 'POST',
            body: new FormData(form)
        })
        .then(res => res.text())
        .then(res => setActivityDiv(res))
        .catch(err => console.error(err));;
    }
  
    // Access the form element...
    const form = document.getElementById( "create_form" );
  
    // ...and take over its submit event.
    form.addEventListener( "submit", function ( event ) {
      event.preventDefault();
  
      sendData();
    } );
  } );
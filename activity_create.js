window.addEventListener( "load", function () {
    function sendData() {
    
        // make post request
        fetch(API_URL + "/create_activity", {
            method: 'POST',
            body: new FormData(form)
        })
        .then(res => res.text())
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
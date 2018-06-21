document.addEventListener('DOMContentLoaded', function () {

    // References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        error_message = document.querySelector('#error-message');


    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    document.getElementById('camera-stream-wo-js').style.display = 'none';


    if(!navigator.getMedia){
        document.getElementById('camera-stream-wo-js').style.display = 'block';
        document.getElementById('camera-stream-with-js').style.display = 'none';
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else{

        // Request the camera.
        navigator.getMedia(
            {
                video: true
            },
            // Success Callback
            function(stream){

                // Create an object URL for the video stream and
                // set it as src of our HTLM video element.
                video.src = window.URL.createObjectURL(stream);

                // Play the video element to start the stream.
                video.play();
                
         
            },
            // Error Callback
            function(err){
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );

    }



    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function(e){

        e.preventDefault();

        // Start video playback manually.
        video.play();
        showVideo();

    });


    take_photo_btn.addEventListener("click", function(e){

        e.preventDefault();
        var snap = takeSnapshot();

        // Show image. 
        image.setAttribute('src', snap);
        image.classList.add("visible");

        // Enable delete and save buttons
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        // Set the href attribute of the download button to the snap url.
        download_photo_btn.href = snap;

        // Pause video playback of stream.
        video.pause();

    });


    delete_photo_btn.addEventListener("click", function(e){

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        video.play();

    });

    function analyzeSnapshot(snapSrc, width, height) {
        var image = new Image(width,height);
    
        image.onload = function() {
            requestFaceAnalysis(image, handleFaceAnalysisResponse);
            console.log('[faceAnalysis] Face analysis request sent.');
        };
        // load image object
        image.src = snapSrc;
    }

    function showVideo(){
        // Display the video stream and the controls.
    
        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }
    
    
    function takeSnapshot(){
        // Here we're using a trick that involves a hidden canvas element.  
    
        var hidden_canvas = document.getElementById('hidden-canvas'),
            context = hidden_canvas.getContext('2d');
    
        var width = video.videoWidth,
            height = video.videoHeight;
    
        if (width && height) {
    
            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;
    
            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            const snap = hidden_canvas.toDataURL('image/png');

            analyzeSnapshot(snap, width, height);
    
            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return snap;
        }
    }
    
    
    function displayErrorMessage(error_msg, error){
        error = error || "";
        if(error){
            console.error(error);
        }
    
        error_message.innerText = error_msg;
    
        hideUI();
        error_message.classList.add("visible");
    }
    
    
    function hideUI(){
        // Helper function for clearing the app UI.
    
        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }
    
    function requestFaceAnalysis(image, callback) {
        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        var url = 'https://proxyboy2.herokuapp.com/fpp/detect';
        
        // Prepare form data
        formData.append("api_key", faceplusplus_api_key());
        formData.append("api_secret", faceplusplus_api_secret());
        formData.append("return_attributes", 'eyestatus,gender,age,ethnicity,eyestatus,beauty,skinstatus');
        formData.append("image_base64", getBase64Image(image));
    
        // Register callback for response
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
        }
        
        // Send request
        xhr.open('POST', url);
        xhr.send(formData);
    }
    
    function handleFaceAnalysisResponse(response) {
        try {
            var jsonResponse = JSON.parse(response);
            if (jsonResponse.faces.length && jsonResponse.faces.length > 0) {
                window.TETRIS_currentFaceValue = jsonResponse.faces[0].attributes;
                console.log('[faceAnalysis] Face analysis successful.');
            } else {
                console.log('[faceAnalysis] No faces recognized.');
            }
            //console.log(JSON.stringify(jsonResponse, null, 4));            
        } catch (error) {
            console.log('[faceAnalysis] Invalid response from server.');            
        }

    }
    
    // Helper function to get base64 encoded image data
    // source: https://stackoverflow.com/a/934925/298479
    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to guess the
        // original format, but be aware the using "image/jpg" will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    function faceplusplus_api_key() {
        return 'zySNNAGkKDYDJXLRUZcfjz_Ui43WoY-W';
    }
        
    function faceplusplus_api_secret() {
        return 'GJc3Od5JpTdCnhtlP4ZANhT9dxBz1sWX';
    }
       

});


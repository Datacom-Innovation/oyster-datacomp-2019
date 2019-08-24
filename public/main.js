$(function() {

  var socket = io();

  var $homeStatus = $('.homeStatus'); // Home Status Row
  var $screenStatus = $('.screenStatus'); // Screen Status Row
  var $personStatus = $('.personStatus'); // Person Status Row
  var $googleMessage = $('.google-message'); //Google Message
  var $userName = $('.userName'); //User's name
  var $listing = $('.listimg'); //Listing 
  var $videoClass = $('.videoClass'); //Listing 

  const displayHomeStatus = (data) => {
    console.log(data)
    $homeStatus.text(data.message)
    $googleMessage.text(data.message)
    $googleMessage.hide()
    $googleMessage.fadeIn(2000)
    $googleMessage.delay(3000).fadeOut(2000)

  }

  //Moving sensor
  const displayScreenStatus = (data) => {
    console.log(data)
    // $screenStatus.text(data.message.text)
    $screenStatus.fadeIn(2000)
    $screenStatus.delay(3000).fadeOut(2000)
  }

  const displayPersonStatus = (data) => {
    console.log(data)
    $personStatus.text(data.message.name)
    $userName.text("Hi " + data.message.name)
  }

  const displayImage = (data) => {
    $listing.css("display", "block")
    $listing.attr("src", data.url)
    if (data.url == "") {
      $listing.attr("src", "./img/Steps.png")
      $listing.css("display", "invisible")
      $listing.hide()
      $listing.fadeIn(2000)
    } else {
      $listing.attr("src", data.url)
      $listing.css("visibility", "visible")
      $listing.hide()
      $listing.fadeIn(2000)
      $listing.delay(3000).fadeOut(2000)
    }
    
    console.log(data)
  }

  const displayVideo = (data) => {
    $videoClass.css("display", "block")
    $videoClass.attr("src", data.url)
    $videoClass.hide()
    $videoClass.fadeIn(2000)
    $videoClass.delay(5000).fadeOut(2000)
    
    console.log(data)
  }

  const displayFitbitData = (data) => {
    console.log(data)
  }

  // **** Socket Events ****
  console.log("testing123")

  socket.on('voice_text', (data) => {
    // Display home status
    displayHomeStatus(data);
  });

  socket.on('screen_status', (data) => {
    // Display screen status
    displayScreenStatus(data);
  });

  socket.on('person_status', (data) => {
    // Display home status
    displayPersonStatus(data);
  });

  socket.on('show_health_info', (data) => {
    // Display home status
    displayImage(data);
  });
  
  socket.on('show_hinz_schedule', (data) => {
    // Display home status
    displayImage(data);
  });
  
  socket.on('show_gout_video', (data) => {
    // Display home status
    displayVideo(data);
	});

  socket.on('fitbit_data', (data) => {
    // Display home status
    displayFitbitData(data);
  });

  socket.on('show_sleep_pattern', (data) => {
    // Display home status
    displayImage(data);
  });
  
  socket.on('show_nutritional_pattern', (data) => {
    // Display home status
    displayImage(data);
	});


  socket.on('show_fitness_details', (data) => {
    // Display home status
    displayImage(data);
  });

});

// manipulate values in this obj to turn on specific pose detection scenarios
const poseDetectionState = {
    detectRightArmRaised: false,
    detectLeftArmRaised: false,
    detectBothArmsRaised: false,
    detectTouchToes: false,
    detectSideStretch: false,
    detectDab: false,
};

async function setupPosenet() {
    return await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        inputResolution: 513,
        multiplier: 1.0,
        quantBytes: 2,
    });
}

async function loadVideo() {
    const video = await setupCamera();
    video.play();

    return video;
}

async function setupCamera() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    const video = document.getElementById('posenet-video');
    video.width = 1280;
    video.height = 720;
    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: 1280,
            height: 720,
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

function allFalse(object) {
    for (var i in object) {
        if (object[i] === true) return false;
    }
    return true;
}

function detectPoseInRealTime(video, net) {
    function dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    }

    function magnitude(vector) {
        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
    }

    function raiseRightHand(pose) {
        var rightShoulder = pose[0]["keypoints"][6]
        var rightElbow = pose[0]["keypoints"][8]
        var rightWrist = pose[0]["keypoints"][10]

        var isRightArmRaised = rightWrist.position.y < rightElbow.position.y && rightElbow.position.y < rightShoulder.position.y

        return isRightArmRaised;
    }

    function raiseLeftHand(pose) {
        var leftShoulder = pose[0]["keypoints"][5]
        var leftElbow = pose[0]["keypoints"][7]
        var leftWrist = pose[0]["keypoints"][9]

        var isLeftArmRaised = leftWrist.position.y < leftElbow.position.y && leftElbow.position.y < leftShoulder.position.y

        return isLeftArmRaised;
    }

    function raiseHands(pose) {
        var isRightArmRaised = raiseRightHand(pose);
        var isLeftArmRaised = raiseLeftHand(pose);
        var isBothArmsRaised = isLeftArmRaised && isRightArmRaised;

        return isBothArmsRaised;
    }

    function touchToes(pose) {
        var rightWrist = pose[0]["keypoints"][10]
        var leftWrist = pose[0]["keypoints"][9]
        var leftKnee = pose[0]["keypoints"][13]
        var rightKnee = pose[0]["keypoints"][14]

        var isToesTouched = leftWrist.position.y > leftKnee.position.y && rightWrist.position.y > rightKnee.position.y

        return isToesTouched;
    }

    function sideStretch(pose) {
        var leftHip = pose[0]["keypoints"][11]
        var rightHip = pose[0]["keypoints"][12]

        var leftShoulder = pose[0]["keypoints"][5]
        var rightShoulder = pose[0]["keypoints"][6]

        var leftKnee = pose[0]["keypoints"][13]
        var rightKnee = pose[0]["keypoints"][14]

        var v1 = {
            x: leftShoulder.position.x - leftHip.position.x,
            y: rightShoulder.position.y - rightHip.position.y
        }

        var v2 = {
            x: leftShoulder.position.x - leftKnee.position.x,
            y: rightShoulder.position.y - rightKnee.position.y
        }

        var angle = Math.acos(dotProduct(v1,v2)/(magnitude(v1)*magnitude(v2)))

        var isSideStretched = angle > minSideStretchAngle

        return isSideStretched;
    }

    function checkDab(pose) {
        var rightWrist = pose[0]["keypoints"][10]
        var leftWrist = pose[0]["keypoints"][9]

        var leftShoulder = pose[0]["keypoints"][5]
        var rightShoulder = pose[0]["keypoints"][6]

        var isRightDab = (leftWrist.position.x > leftShoulder.position.x && leftWrist.position.x < rightShoulder.position.x) && rightWrist.position.y < rightShoulder.position.y
        var isLeftDab = (rightWrist.position.x < rightShoulder.position.x && rightWrist.position.x > leftShoulder.position.x) && leftWrist.position.y < leftShoulder.position.y

        return isRightDab || isLeftDab;
    }

    async function poseDetectionFrame() {
        // skip frame if we are not specifically looking for any poses
        if (allFalse(poseDetectionState)) {
            console.debug('skip frame');
            requestAnimationFrame(poseDetectionFrame);
            return;
        }
        console.debug('process frame');

        let poses = [];
        const pose = await net.estimatePoses(video, {
            flipHorizontal: true,
            decodingMethod: 'single-person',
        });
        poses = poses.concat(pose);

        // insert pose detection code here
        if (poseDetectionState.detectRightArmRaised && raiseRightHand(pose)) {
            console.log('raised right arm detected');
        }

        if (poseDetectionState.detectLeftArmRaised && raiseLeftHand(pose)) {
            console.log('raised left arm detected');
        }

        if (poseDetectionState.detectBothArmsRaised && raiseHands(pose)) {
            console.log('raised arms detected');
        }

        if (poseDetectionState.detectToeTouch && touchToes(pose)) {
            console.log('toe touch detected');
        }

        if (poseDetectionState.detectSideStretch && sideStretch(pose)) {
            console.log('side stretch detected');
        }

        if (poseDetectionState.detectDab && checkDab(pose)) {
            console.log('dab detected');
        }

        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

//invokes functions as soon as window loads
window.onload = async function(){
    const net = await setupPosenet();
    const video = await loadVideo();
    detectPoseInRealTime(video, net);
};

'use strict';


var io = require('socket.io');
exports.SetIO = function (IO) {
    io = IO;
}

var intentMapper = {
    intents: [
        { IntentID: "WhoAreYou", AudioResponse: "I'm Pearl, your assistant! I can help you be a better you. What would you like to do?", VisualResponse: "I'm Pearl, your assistant! I can help you be a better you. What would you like to do?" },
        { IntentID: "DisplayNumber", AudioResponse: "Roger that!", VisualResponse: "I can see that you have asked me to display a number on the display" },
        { IntentID: "ShowHealthInfo", AudioResponse: "That’s not nice. You know, you’re tracking really well. Take a look at your stats! You are doing so much better than you think.", VisualResponse: "That’s not nice. You know, you’re tracking really well. Take a look at your stats! You are doing so much better than you think." },
        { IntentID: "ShowPhotoshopMagazingCover", AudioResponse: "Sally, you know the term “fake news”? well, social media is often like fake news. People only show the highlights of their lives but would never show their low points.", VisualResponse: "Sally, you know the term “fake news”? well, social media is often like fake news. People only show the highlights of their lives but would never show their low points." },
        { IntentID: "Default Welcome Intent", AudioResponse: "Hi Scott, how are you today?", VisualResponse: "Hi Scott, how are you today?" },
        { IntentID: "MorningMira", AudioResponse: "Good Morning Scott, nice day in Wellington", VisualResponse: "Good Morning Scott, nice day in Wellington" },
        { IntentID: "BusyDayHINZ", AudioResponse: "Yes, here is the schedule", VisualResponse: "Yes, here is the schedule" },
        { IntentID: "YesIndeed", AudioResponse: "You sound tired, how did you sleep?", VisualResponse: "You sound tired, how did you sleep?" },
        { IntentID: "HotelBed", AudioResponse: "Yes you had a poor nights sleep. How's the food?", VisualResponse: "Yes you had a poor nights sleep. How's the food?" },
        { IntentID: "AverageFood", AudioResponse: "However, nutritional intake was within acceptable limits", VisualResponse: "However, nutritional intake was within acceptable limits" },
        { IntentID: "FacebookAbs", AudioResponse: "Remember lots of images posted on Facebook are fake. And you are doing well on your fitness objectives", VisualResponse: "Remember lots of images posted on Facebook are fake. And you are doing well on your fitness objectives" },
        { IntentID: "DatacomPresentable", AudioResponse: "You look well groomed today Scott. But looks like you need a haircut soon – shall I schedule one next week", VisualResponse: "You look well groomed today Scott. But looks like you need a haircut soon – shall I schedule one next week" },
        { IntentID: "ThanksMira", AudioResponse: "Ok, how are you feeling today?", VisualResponse: "Ok, how are you feeling today?" },
        { IntentID: "FeetAching", AudioResponse: "Don’t forget to take your anti-inflammitaries at your next meal", VisualResponse: "Don’t forget to take your anti-inflammitaries at your next meal" },
        { IntentID: "RogerThat", AudioResponse: "And This item on causes for Gout was on the News last night that you should check out. I will send it to your phone.", VisualResponse: "And This item on causes for Gout was on the News last night that you should check out. I will send it to your phone." },
        { IntentID: "WishLuck", AudioResponse: "Good luck", VisualResponse: "Good luck" },

        { IntentID: "Stretches", AudioResponse: "Audio response stretch", VisualResponse: "Visual response Stretch" },

        //{ IntentID:"ThanksMira", AudioResponse:"Great. By the way, don’t forget to wear a jacket – it’s predicted to be cold today.", VisualResponse:"15 °C"},

    ]
}





var noIntentFound = { "IntentID": "None", "AudioResponse": "Sorry, can you try that again?", "VisualResponse": "Sorry, can you try that again?" };

function FindIntent(IntentId) {

    for (var i = 0; i < intentMapper.intents.length; i++) {
        if (intentMapper.intents[i].IntentID === IntentId) {
            return intentMapper.intents[i];
        }
    }
    return intentMapper.intents[0];
}

exports.processRequest = function (req, res) {
    console.log("Logging req");
    var picked = FindIntent(req.body.result.metadata.intentName);
    console.log(picked);
    if (picked != null) {
        // if (picked.IntentID === "ShowPhotoshopMagazingCover") {
        //     io.emit('show_health_info', {
        //         status: true,
        //         url: "https://magicmirror.blob.core.windows.net/miraimages/ConferenceDay2.png"
        //     });
        // }
        
        if (picked.IntentID === "HotelBed") {
            io.emit('show_sleep_pattern', {
                status: true,
                url: "https://magicmirror.blob.core.windows.net/miraimages/Sleep2.png"
            });
        }

        if (picked.IntentID === "AverageFood") {
            io.emit('show_nutritional_pattern', {
                status: true,
                url: "https://magicmirror.blob.core.windows.net/miraimages/Nutrition2.png"
            });
        }

        if (picked.IntentID === "FacebookAbs") {
            io.emit('show_fitness_details', {
                status: true,
                url: "https://magicmirror.blob.core.windows.net/miraimages/Calories2.png"
            });
        }

        if (picked.IntentID === "BusyDayHINZ") {
            io.emit('show_hinz_schedule', {
                status: true,
                url: "https://magicmirror.blob.core.windows.net/miraimages/Schedule2.png"
            });
        }

        if (picked.IntentID === "RogerThat") {
            io.emit('show_gout_video', {
                status: true,
                url: "https://magicmirror.blob.core.windows.net/miravideos/963482464001_5847256729001_5847249356001.mp4"
            });
        }

        if (picked.IntentID === "ShowHealthInfo") {
            // Show health information on display
            io.emit('show_health_info', {
                status: true,
                url: ""
            });
        }

        io.emit('voice_text', {
            username: "test",
            message: picked.VisualResponse
        });

        return res.json({
            speech: picked.AudioResponse,
            displayText: picked.AudioResponse,
            source: picked.AudioResponse
        });

    }
    else {
        io.emit('home_status', {
            username: "test",
            message: "sorry, can you try that again?"
        });
        return res.json({
            speech: 'sorry, can you try that again?',
            displayText: 'sorry, can you try that again?',
            source: 'fullfilmentAPI'
        });
    }

};
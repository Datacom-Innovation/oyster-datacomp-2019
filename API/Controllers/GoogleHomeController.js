"use strict";

var io = require("socket.io");
exports.SetIO = function(IO) {
  io = IO;
};

var intentMapper = {
  intents: [
    {
      IntentID: "WhoAreYou",
      AudioResponse:
        "I'm Pearl, your assistant! I can help you be a better you. What would you like to do?",
      VisualResponse:
        "I'm Pearl, your assistant! I can help you be a better you. What would you like to do?"
    },
    {
      IntentID: "BackPain",
      AudioResponse: "Here are some exercises you can do right now",
      VisualResponse: "Here are some exercises you can do right now"
    },
    {
      IntentID: "CoffeeBreak",
      AudioResponse: "Take a quick walk and do some of these stretches",
      VisualResponse: "Take a quick walk and do some of these stretches"
    },
    {
      IntentID: "Stretches",
      AudioResponse: "Get up from your desk regularly, and take active breaks",
      VisualResponse: "Get up from your desk regularly, and take active breaks"
    },
    {
      IntentID: "MoreAwake",
      AudioResponse: "Some short bursts of physical activity will help",
      VisualResponse: "Some short bursts of physical activity will help"
    }, 
    {
      IntentID: "NotGreat",
      AudioResponse: "Okay, why don’t we do some simple stretches? Let’s start with the first one",
      VisualResponse: "Okay, why don’t we do some simple stretches? Let’s start with the first one"
    }, 
    {
      IntentID: "NotGreat",
      AudioResponse: "Okay, why don’t we do some simple stretches? Let’s start with the first one",
      VisualResponse: "Okay, why don’t we do some simple stretches? Let’s start with the first one"
    }
  ]
};

var noIntentFound = {
  IntentID: "None",
  AudioResponse: "",
  VisualResponse: ""
};

function FindIntent(IntentId) {
  for (var i = 0; i < intentMapper.intents.length; i++) {
    if (intentMapper.intents[i].IntentID === IntentId) {
      return intentMapper.intents[i];
    }
  }
  return noIntentFound;
}

exports.processRequest = function(req, res) {
  console.log("Logging req");
  var picked = FindIntent(req.body.queryResult.intent.displayName);
  console.log(picked);
  if (picked != null) {
    // if (picked.IntentID === "ShowPhotoshopMagazingCover") {
    //     io.emit('show_health_info', {
    //         status: true,
    //         url: "https://magicmirror.blob.core.windows.net/miraimages/ConferenceDay2.png"
    //     });
    // }

    // if (picked.IntentID === "HotelBed") {
    //   io.emit("show_sleep_pattern", {
    //     status: true,
    //     url: "https://magicmirror.blob.core.windows.net/miraimages/Sleep2.png"
    //   });
    // }

    // if (picked.IntentID === "AverageFood") {
    //   io.emit("show_nutritional_pattern", {
    //     status: true,
    //     url:
    //       "https://magicmirror.blob.core.windows.net/miraimages/Nutrition2.png"
    //   });
    // }

    // if (picked.IntentID === "FacebookAbs") {
    //   io.emit("show_fitness_details", {
    //     status: true,
    //     url:
    //       "https://magicmirror.blob.core.windows.net/miraimages/Calories2.png"
    //   });
    // }

    // if (picked.IntentID === "BusyDayHINZ") {
    //   io.emit("show_hinz_schedule", {
    //     status: true,
    //     url:
    //       "https://magicmirror.blob.core.windows.net/miraimages/Schedule2.png"
    //   });
    // }

    // if (picked.IntentID === "RogerThat") {
    //   io.emit("show_gout_video", {
    //     status: true,
    //     url:
    //       "https://magicmirror.blob.core.windows.net/miravideos/963482464001_5847256729001_5847249356001.mp4"
    //   });
    // }

    // if (picked.IntentID === "ShowHealthInfo") {
    //   // Show health information on display
    //   io.emit("show_health_info", {
    //     status: true,
    //     url: ""
    //   });
    // }

    io.emit("voice_text", {
      username: "test",
      message: picked.VisualResponse
    });

    return res.json({
      fulfillmentText: picked.AudioResponse,
      source: picked.AudioResponse
    });
  } else {
    io.emit("home_status", {
      username: "test",
      message: ""
    });
    return res.json({
      speech: "",
      displayText: "",
      source: "fullfilmentAPI"
    });
  }
};

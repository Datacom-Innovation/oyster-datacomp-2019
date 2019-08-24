"use strict";

var io = require("socket.io");
exports.SetIO = function(IO) {
  io = IO;
};

var intentMapper = {
  intents: [
    {
      IntentID: "BothArmsRaised",
      AudioResponse: "Great stuff, let’s keep going",
      VisualResponse: "Great stuff, let’s keep going"
    },
    {
      IntentID: "NotGreat",
      AudioResponse:
        "Okay, why don’t we do some simple stretches? Let’s start with the first one",
      VisualResponse:
        "Okay, why don’t we do some simple stretches? Let’s start with the first one"
    },
    {
      IntentID: "SideStretch",
      AudioResponse: "Nice work! How about one last stretch? Let’s do it",
      VisualResponse: "Nice work! How about one last stretch? Let’s do it"
    },
    {
      IntentID: "DabDone",
      AudioResponse: "Awesome! How did that feel?",
      VisualResponse: "Awesome! How did that feel?"
    },
    {
      IntentID: "Thanks",
      AudioResponse: "Awesome, see you later for more stretches.",
      VisualResponse: "Awesome, see you later for more stretches."
    },
    {
      IntentID: "Default Welcome Intent",
      AudioResponse:
        "Hi there, how are you feeling today? 1 being not so great and 5 being great.",
      VisualResponse:
        "Hi there, how are you feeling today? 1 being not so great and 5 being great."
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
    if (picked.IntentID === "NotGreat") {
      io.emit("show_both_arms", {
        status: true,
        url:
          "https://pearlimages.blob.core.windows.net/pearlimages/hands_up.png",
        message: picked.VisualResponse
      });
    }

    if (picked.IntentID === "BothArmsRaised") {
      io.emit("show_side_stretch", {
        status: true,
        url: "https://pearlimages.blob.core.windows.net/pearlimages/bend.png",
        message: picked.VisualResponse
      });
    }

    if (picked.IntentID === "SideStretch") {
      io.emit("show_dab_done", {
        status: true,
        url:
          "https://pearlimages.blob.core.windows.net/pearlimages/dab_outline.png",
        message: picked.VisualResponse
      });
    }

    if (picked.IntentID === "Thanks") {
      io.emit("thanks_final", {
        status: true
      });
    }

    if (picked.IntentID === "Default Welcome Intent") {
      io.emit("greeting_start", {
        status: true,
        message: picked.VisualResponse
      });
    }

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

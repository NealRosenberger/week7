$("document").ready(function() {
       
    var caputredValues;

    var config = {
    apiKey: "AIzaSyBPKc-V85oJ79mcjvXujJchtdYzEnYPxW4",
    authDomain: "traindatabase-9ad1d.firebaseapp.com",
    databaseURL: "https://traindatabase-9ad1d.firebaseio.com",
    projectId: "traindatabase-9ad1d",
    storageBucket: "traindatabase-9ad1d.appspot.com",
    messagingSenderId: "796170825187"
    };
    firebase.initializeApp(config);

    var trainDatabase = firebase.database();

 
    captureData = function() {
        //Capture imputs 
        var a = $("#trainNameInput").val().trim();
        var b = $("#destinationInput").val().trim();
        var c = $("#frequencyInput").val().trim();
        var d = $("#startTimeInput").val().trim();

        //local to push as object to Firebase
        caputredValues = {
            name: a,
            destination: b,
            frequency: c,
            start: d
        }

        //push data to Firebase
        trainDatabase.ref().push(caputredValues);
        alert("Train added sucessfully");
        clearDataForms();
    };

    clearDataForms = function() {
       
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#frequencyInput").val("");
        $("#startTimeInput").val("");
        caputredValues;
    };


    $("#addTrainBtn").on("click", function() {
        captureData();
        return false; 
    });

    //firebase.js function child , run function with return parameter
    trainDatabase.on("child_added", function(snapshot) {
        
        var na = snapshot.val().name;
        var dest = snapshot.val().destination;
        var freq = snapshot.val().frequency;
        var st = snapshot.val().start;

        var trainFrequency = freq;
        var firstTrain = st;

        //subtract one year to ensure to time conflicts over calculated microseconds.
        var fixTime = moment(firstTrain, "hh:mm").subtract(1, "years");
    
        var currentMinute = moment();
        //format post to html
        $("#currentTimeSpan").html(" Current Time : " + currentMinute.format("hh:mm"));

        var timeDifference = moment().diff(moment(fixTime), "minutes");
        var timeRemaining = timeDifference % trainFrequency;
        var minutesTillTrain = trainFrequency - timeRemaining;
        var nextTrain = moment().add(minutesTillTrain, "minutes")
        var arrivalTime = moment(nextTrain).format("hh:mm");

        //create  row for each train
        $("#trainScheduleBody").append("<tr><td>" + na + "</td><td>" + dest + "</td><td>" + freq + "</td><td>" + st + "</td><td>" + arrivalTime + "</td><td>" + minutesTillTrain + " Minutes" + "</td></tr>");
    });
}); 

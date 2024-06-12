var currentScreen = "room";
var defaultRate = "nonsummer";
var alternateRate = "summer";
var currentRoomText;
var currentRoomId;
var currentApplianceId;
var summerOffPeak;
var summerMidPeak;
var summerPeak;
var nonsummerOffPeak;
var nonsummerPeak;
var summerTotalCost = 0;
var nonsummerTotalCost = 0;
var summerPeakCost = 0;
var summerMidPeakCost = 0;
var summerOffPeakCost = 0;
var nonsummerPeakCost = 0;
var nonsummerOffPeakCost = 0;
var summerOffPeakCounter = 0;
var summerMidPeakCounter = 0;
var summerPeakCounter = 0;
var nonsummerOffPeakCounter = 0;
var nonsummerPeakCounter = 0;
const summerPeakPrice = 0.3215;
const summerMidPeakPrice = 0.1827;
const summerOffPeakPrice = 0.1323;
const nonsummerPeakPrice = 0.1516;
const nonsummerOffPeakPrice = 0.1098;
var applianceListJSON = {
  kitchen: {
    dishwasher: {
      value: 1.8,
      time: {},
    },
    dishwasherHE: {
      value: 1.8,
      time: {},
    },
    microwave: {
      value: 0.08,
      time: {},
    },
    electricOven: {
      value: 3.5,
      time: {},
    },
    electricCooktop: {
      value: 0.8,
      time: {},
    },
    refrigerator: {
      value: 0.06,
      time: {},
    },
    refrigeratorHE: {
      value: 0.04,
      time: {},
    },
    slowCooker: {
      value: 2.1,
      time: {},
    },
  },
  laundry: {
    dryer: {
      value: 3.75,
      time: {},
    },
    dryerHE: {
      value: 3,
      time: {},
    },
    washingMachine: {
      value: 0.75,
      time: {},
    },
    washingMachineHE: {
      value: 0.42,
      time: {},
    },
  },
  living: {
    centralAC: {
      value: 9,
      time: {},
    },
    houseFan: {
      value: 1.05,
      time: {},
    },
    TV: {
      value: 0.45,
      time: {},
    },
    vaccum: {
      value: 0.36,
      time: {},
    },
    desktop: {
      value: 0.15,
      time: {},
    },
    laptop: {
      value: 0.23,
      time: {},
    },
    gamingSystem: {
      value: 0.33,
      time: {},
    },
    ceilingFan: {
      value: 0.18,
      time: {},
    },
  },
  bedBath: {
    spaceHeater: {
      value: 1.5,
      time: {},
    },
    roomAC: {
      value: 3,
      time: {},
    },
    electricBlanket: {
      value: 0.42,
      time: {},
    },
    roomTV: {
      value: 0.36,
      time: {},
    },
    hairDryer: {
      value: 0.38,
      time: {},
    },
  },
  garage: {
    singlePoolPump: {
      value: 4.2,
      time: {},
    },
    variablePoolPump: {
      value: 0.9,
      time: {},
    },
    EVcharger: {
      value: 19.8,
      time: {},
    },
    freezer: { value: 0.075, time: {} },
    freezerHE: { value: 0.06, time: {} },
    refrigerator2: { value: 0.075, time: {} },
    refrigerator2HE: { value: 0.045, time: {} },
  },
};
$(document).ready(function (event) {
  $("#summerTab").on("click", function () {
    toggleRate("#summerTab", "#summerRateContent", "#nonsummerRateContent");
  });
  $("#nonsummerTab").on("click", function () {
    toggleRate("#nonsummerTab", "#nonsummerRateContent", "#summerRateContent");
  });
  $(".room").on("click", function () {
    currentRoomId = this.id;
    var roomTitle = $("#" + currentRoomId)
      .children("span")
      .text();
    showAppliances(roomTitle);
    if (
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >
      991
    ) {
      adjustHeight();
    }
  });
  $(".appliance").on("click", function () {
    /*grab correct appliance name for display and to determine calc*/
    if (currentApplianceId != undefined) {
      if (currentApplianceId != this.id) {
        // clears total when new appliance is clicked
        // clearSelections(this.id); ASK ABOUT THESE IF STATEMENTS
      }
    }
    currentApplianceId = this.id;
    toggleTimes();
    if (
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >
      991
    ) {
      adjustHeight();
    }
    //console.log(currentApplianceId);
  });
  $(".timePeriod").on("click", function () {
    timeSelection(this);
  });
  $("#backArrow").on("click", function () {
    returnToRooms();
  });
  $("#roomButton").on("click", function () {
    returnToRooms();
  });
  applyURLParams();
  $(".shareText").on("click", function () {
    var nonsummerURL = generateURL();
    var summerURL = generateURL();
    if (this.id == "summerShare") {
      $("#summerURL").text(summerURL);
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        iosCopyToClipboard(summerURL);
      } else {
        copyToClipboard(summerURL);
      }
      $("#summerShare").find(".clipboardText").css("visibility", "visible");
    } else {
      $("#nonsummerURL").text(nonsummerURL);
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        iosCopyToClipboard(nonsummerURL);
      } else {
        copyToClipboard(nonsummerURL);
      }
      $("#nonsummerShare").find(".clipboardText").css("visibility", "visible");
    }
    setTimeout(function () {
      $(".clipboardText").css("visibility", "hidden");
    }, 4000);
  });
});
function applyURLParams() {
  var urlParams = getUrlParams();
  if (urlParams.rate == alternateRate) {
    $("#" + alternateRate + "Tab").click();
  } else {
    $("#" + defaultRate + "Tab").click();
  }
  if (urlParams.room != undefined) {
    if (applianceListJSON[urlParams.room] != undefined) {
      currentRoomId = urlParams.room;
      var roomTitle = $("#" + currentRoomId)
        .children("span")
        .text();
      showAppliances(roomTitle);
      if (
        Math.max(document.documentElement.clientWidth, window.innerWidth || 0) >
        991
      ) {
        adjustHeight();
      }
      if (!(urlParams.app == undefined)) {
        if (currentApplianceId != undefined) {
          if (currentApplianceId != urlParams.app) {
            clearSelections(urlParams.app);
          }
        }
        currentApplianceId = urlParams.app;
        toggleTimes();
        if (
          Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ) > 991
        ) {
          adjustHeight();
        }
      }
      if (urlParams.times != undefined) {
        var numberOfUrlTimePeriods = urlParams.times.length;
        for (i = 0; i < numberOfUrlTimePeriods; i++) {
          $(".costInfo").css("opacity", 1);
          switch (urlParams.times[i]) {
            case "m":
              var timePeriod = $("#" + currentApplianceId)
                .next()
                .find(".morning");
              timeSelection(timePeriod);
              break;
            case "a":
              var timePeriod = $("#" + currentApplianceId)
                .next()
                .find(".afternoon");
              timeSelection(timePeriod);
              break;
            case "e":
              var timePeriod = $("#" + currentApplianceId)
                .next()
                .find(".evening");
              timeSelection(timePeriod);
              break;
            case "n":
              var timePeriod = $("#" + currentApplianceId)
                .next()
                .find(".night");
              timeSelection(timePeriod);
              break;
            case "d":
              var timePeriod = $("#" + currentApplianceId)
                .next()
                .find(".allDay");
              timeSelection(timePeriod);
              break;
            default:
              console.log("urlParams error");
          }
        }
      }
    }
  }
}
function copyToClipboard(string) {
  const el = document.createElement("textarea");
  el.value = string;
  el.setAttribute("readOnly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
function iosCopyToClipboard(string) {
  const el = document.createElement("textarea");
  el.value = string;
  el.setAttribute("contentEditable", "true");
  el.setAttribute("readOnly", "false");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  var range = document.createRange();
  range.selectNodeContents(el);
  var s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);
  el.setSelectionRange(0, 999999);
  document.execCommand("copy");
  document.body.removeChild(el);
}
function generateURL() {
  var URL = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, "");
  var rate = $(".tab.active").attr("id").replace("Tab", "");
  URL = URL + "?rate=" + rate;
  if (currentRoomId != undefined) {
    URL = URL + "&room=" + currentRoomId;
    if (currentApplianceId != undefined) {
      URL = URL + "&app=" + currentApplianceId;
      var timeClasses = $("#" + currentApplianceId)
        .next()
        .find(".timePeriod.active");
      var times = [];
      if (timeClasses.length != 0) {
        URL = URL + "&times=";
        for (i = 0; i < timeClasses.length; i++) {
          times[i] = timeClasses[i].className.split(" ")[1];
        }
      }
      for (i = 0; i < times.length; i++) {
        switch (times[i]) {
          case "morning":
            URL = URL + "m";
            break;
          case "afternoon":
            URL = URL + "a";
            break;
          case "evening":
            URL = URL + "e";
            break;
          case "night":
            URL = URL + "n";
            break;
          case "allDay":
            URL = URL + "d";
            break;
          default:
            console.log("error building URL");
        }
      }
    }
  }
  return URL;
}
function getUrlParams() {
  var params = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      params[key] = value;
    }
  );
  return params;
}
function adjustHeight() {
  var height = $("#leftPanel").height() - $(".tab").outerHeight();
  $(".tabContent").outerHeight(height);
}
function calculateCost(timeId, summer, optionalMultiplier) {
  if (!optionalMultiplier) {
    optionalMultiplier = 1;
  }
  var applianceCost =
    applianceListJSON[currentRoomId][currentApplianceId]["value"];
  var cost;
  if (timeId == "morning") {
    if (summer) {
      cost = optionalMultiplier * (applianceCost * summerOffPeakPrice);
    } else {
      cost = optionalMultiplier * (applianceCost * nonsummerOffPeakPrice);
    }
  } else if (timeId == "afternoon") {
    if (summer) {
      cost = optionalMultiplier * (applianceCost * summerMidPeakPrice);
    } else {
      cost = optionalMultiplier * (applianceCost * nonsummerOffPeakPrice);
    }
  } else if (timeId == "evening") {
    if (summer) {
      cost = optionalMultiplier * (applianceCost * summerPeakPrice);
    } else {
      cost = optionalMultiplier * (applianceCost * nonsummerPeakPrice);
    }
  } else if (timeId == "night") {
    if (summer) {
      cost = optionalMultiplier * (applianceCost * summerMidPeakPrice);
    } else {
      cost = optionalMultiplier * (applianceCost * nonsummerOffPeakPrice);
    }
  } else {
    /*allDay*/ if (summer) {
      cost =
        calculateCost("morning", 1, 12) +
        calculateCost("afternoon", 1, 9) +
        calculateCost("evening", 1, 3);
    } else {
      cost = calculateCost("morning", 0, 21) + calculateCost("evening", 0, 3);
    }
  }
  var myTotal = Math.round(cost * 100) / 100;

  return myTotal;
}
function clearSelections(applianceToClear) {
  var timeReset = $(".timePeriod.active");
  for (i = 0; i < timeReset.length; i++) {
    timeSelection(timeReset[i]);
  }
  $(".check").removeClass("active");
  console.log("total cleared");
}
function returnToRooms() {
  //clears total when 'choose another room' is clicked
  clearSelections(currentApplianceId);
  currentRoomId = undefined;
  currentRoom = undefined;
  currentApplianceId = undefined;
  currentScreen = "room";
  $(".appliance").next().css("display", "none");
  $(".appliance").find(".fa-angle-up").toggleClass("fa-angle-up fa-angle-down");
  $("#leftNavPanelAppliances").css("display", "none");
  $("#location").html("Select a room");
  $("#leftNavPanelRooms").css("display", "block");
  $("#backArrow").css("visibility", "hidden");
  if (
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 991
  ) {
    adjustHeight();
  }
}
function showAppliances(room) {
  currentScreen = "appliances";
  currentRoomText = room;
  $("#leftNavPanelRooms").css("display", "none");
  $("#location").html(currentRoomText);
  $("#leftNavPanelAppliances").css("display", "block");
  $("#backArrow").css("visibility", "visible");
  $(".applianceList").css("display", "none");
  switch (room) {
    case "Kitchen":
      $("#kitchenApplianceList").css("display", "block");
      break;
    case "Laundry room":
      $("#laundryApplianceList").css("display", "block");
      break;
    case "Living room":
      $("#livingApplianceList").css("display", "block");
      break;
    case "Bedroom/Bathroom":
      $("#bedBathApplianceList").css("display", "block");
      break;
    case "Garage/Outdoor":
      $("#garageApplianceList").css("display", "block");
      break;
    default:
      console.log("error");
  }
}
function styleSelectedAppliance() {
  if (
    jQuery.isEmptyObject(
      applianceListJSON[currentRoomId][currentApplianceId]["time"]
    )
  ) {
    $("#" + currentApplianceId).toggleClass("selected"); /*deselect*/
  } else {
    if (!$("#" + currentApplianceId).hasClass("selected")) {
      /*If not selected, select*/ $("#" + currentApplianceId).toggleClass(
        "selected"
      );
    }
  }
}
function timeSelection(element) {
  /*check value and switch*/ var timeId = $(element)
    .attr("class")
    .split(" ")[1];
  var active = false;
  var check = $(element).find(".check > img");
  if ($(element).hasClass("active")) {
    $(element).removeClass("active");
    $(element).find(".check").removeClass("active");
    $(check).attr(
      "src",
      "smud.org/-/media/Rate-Information/Time-of-Day/Energy-Cost-Calculator/unchecked.ashx?h=16&thn=1&w=16"
    );
    delete applianceListJSON[currentRoomId][currentApplianceId]["time"][timeId];
  } else {
    $(element).addClass("active");
    $(element).find(".check").addClass("active");
    $(check).attr(
      "src",
      "smud.org/-/media/Rate-Information/Time-of-Day/Energy-Cost-Calculator/checked.ashx?h=16&thn=1&w=16"
    );
    applianceListJSON[currentRoomId][currentApplianceId]["time"][timeId] = true;
    active = true;
  }
  styleSelectedAppliance();
  updateCost(timeId, active);
}
function toggleRate(selectedTab, rateToActivate, rateToDeactivate) {
  $(rateToDeactivate).css("display", "none");
  $(".tab").removeClass("active");
  $(rateToActivate).css("display", "block");
  $(selectedTab).addClass("active");
}
function toggleTimes() {
  if (
    $("#" + currentApplianceId)
      .next()
      .css("display") == "block"
  ) {
    $("#" + currentApplianceId)
      .next()
      .css("display", "none");
  } else {
    $(".appliance")
      .find(".fa-angle-up")
      .toggleClass("fa-angle-up fa-angle-down");
    $(".appliance").next().css("display", "none");
    $("#" + currentApplianceId)
      .next()
      .css("display", "block");
  }
  $("#" + currentApplianceId)
    .find(".applianceArrow")
    .toggleClass("fa-angle-down fa-angle-up");
}
function updateCost(timeId, active) {
  var summerFixedTotalCost;
  var nonsummerFixedTotalCost;
  var summerCost = calculateCost(timeId, 1);
  var nonsummerCost = calculateCost(timeId, 0);
  var percentofCircle;
  if (timeId == "morning") {
    if (!active) {
      summerOffPeakCounter--;
      nonsummerOffPeakCounter--;
      summerTotalCost = Math.round((summerTotalCost - summerCost) * 100) / 100;
      summerOffPeakCost =
        Math.round((summerOffPeakCost - summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost - nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost - nonsummerCost) * 100) / 100;
    } else {
      if (summerOffPeakCounter == 0) {
        summerOffPeakCounter = 1;
      } else {
        summerOffPeakCounter++;
      }
      if (nonsummerOffPeakCounter == 0) {
        nonsummerOffPeakCounter = 1;
      } else {
        nonsummerOffPeakCounter++;
      }
      summerTotalCost = Math.round((summerTotalCost + summerCost) * 100) / 100;
      summerOffPeakCost =
        Math.round((summerOffPeakCost + summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost + nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost + nonsummerCost) * 100) / 100;
    }
    summerFixedTotalCost = summerTotalCost.toFixed(2);
    $("#summerCost").html("$" + summerFixedTotalCost);
    $("#summerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerOffPeakCircle")
      .find(".circleCost")
      .text("$" + summerOffPeakCost.toFixed(2));
    nonsummerFixedTotalCost = nonsummerTotalCost.toFixed(2);
    $("#nonsummerCost").html("$" + nonsummerFixedTotalCost);
    $("#nonsummerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerOffPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerOffPeakCost.toFixed(2));
    if (nonsummerOffPeakCounter != 0) {
      $("#nonsummerOffPeakCircle").addClass("active");
    } else {
      $("#nonsummerOffPeakCircle").removeClass("active");
    }
    if (summerOffPeakCounter != 0) {
      $("#summerOffPeakCircle").addClass("active");
    } else {
      $("#summerOffPeakCircle").removeClass("active");
    }
    flashCircle(timeId);
  } else if (timeId == "afternoon") {
    if (!active) {
      summerMidPeakCounter--;
      nonsummerOffPeakCounter--;
      summerTotalCost = Math.round((summerTotalCost - summerCost) * 100) / 100;
      summerMidPeakCost =
        Math.round((summerMidPeakCost - summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost - nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost - nonsummerCost) * 100) / 100;
    } else {
      if (summerMidPeakCounter == 0) {
        summerMidPeakCounter = 1;
      } else {
        summerMidPeakCounter++;
      }
      if (nonsummerOffPeakCounter == 0) {
        nonsummerOffPeakCounter = 1;
      } else {
        nonsummerOffPeakCounter++;
      }
      summerTotalCost = Math.round((summerTotalCost + summerCost) * 100) / 100;
      summerMidPeakCost =
        Math.round((summerMidPeakCost + summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost + nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost + nonsummerCost) * 100) / 100;
    }
    summerFixedTotalCost = summerTotalCost.toFixed(2);
    $("#summerCost").html("$" + summerFixedTotalCost);
    $("#summerMidPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerMidPeakCircle")
      .find(".circleCost")
      .text("$" + summerMidPeakCost.toFixed(2));
    nonsummerFixedTotalCost = nonsummerTotalCost.toFixed(2);
    $("#nonsummerCost").html("$" + nonsummerFixedTotalCost);
    $("#nonsummerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerOffPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerOffPeakCost.toFixed(2));
    if (nonsummerOffPeakCounter != 0) {
      $("#nonsummerOffPeakCircle").addClass("active");
    } else {
      $("#nonsummerOffPeakCircle").removeClass("active");
    }
    if (summerMidPeakCounter != 0) {
      $("#summerMidPeakCircle").addClass("active");
    } else {
      $("#summerMidPeakCircle").removeClass("active");
    }
    flashCircle(timeId);
  } else if (timeId == "evening") {
    if (!active) {
      summerPeakCounter--;
      nonsummerPeakCounter--;
      summerTotalCost = Math.round((summerTotalCost - summerCost) * 100) / 100;
      summerPeakCost = Math.round((summerPeakCost - summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost - nonsummerCost) * 100) / 100;
      nonsummerPeakCost =
        Math.round((nonsummerPeakCost - nonsummerCost) * 100) / 100;
    } else {
      if (summerPeakCounter == 0) {
        summerPeakCounter = 1;
      } else {
        summerPeakCounter++;
      }
      if (nonsummerPeakCounter == 0) {
        nonsummerPeakCounter = 1;
      } else {
        nonsummerPeakCounter++;
      }
      summerTotalCost = Math.round((summerTotalCost + summerCost) * 100) / 100;
      summerPeakCost = Math.round((summerPeakCost + summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost + nonsummerCost) * 100) / 100;
      nonsummerPeakCost =
        Math.round((nonsummerPeakCost + nonsummerCost) * 100) / 100;
    }
    summerFixedTotalCost = summerTotalCost.toFixed(2);
    $("#summerCost").html("$" + summerFixedTotalCost);
    $("#summerPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerPeakCircle")
      .find(".circleCost")
      .text("$" + summerPeakCost.toFixed(2));
    nonsummerFixedTotalCost = nonsummerTotalCost.toFixed(2);
    $("#nonsummerCost").html("$" + nonsummerFixedTotalCost);
    $("#nonsummerPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerPeakCost.toFixed(2));
    if (nonsummerPeakCounter != 0) {
      $("#nonsummerPeakCircle").addClass("active");
    } else {
      $("#nonsummerPeakCircle").removeClass("active");
    }
    if (summerPeakCounter != 0) {
      $("#summerPeakCircle").addClass("active");
    } else {
      $("#summerPeakCircle").removeClass("active");
    }
    flashCircle(timeId);
  } else if (timeId == "night") {
    if (!active) {
      summerMidPeakCounter--;
      nonsummerOffPeakCounter--;
      summerTotalCost = Math.round((summerTotalCost - summerCost) * 100) / 100;
      summerMidPeakCost =
        Math.round((summerMidPeakCost - summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost - nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost - nonsummerCost) * 100) / 100;
    } else {
      if (summerMidPeakCounter == 0) {
        summerMidPeakCounter = 1;
      } else {
        summerMidPeakCounter++;
      }
      if (nonsummerOffPeakCounter == 0) {
        nonsummerOffPeakCounter = 1;
      } else {
        nonsummerOffPeakCounter++;
      }
      summerTotalCost = Math.round((summerTotalCost + summerCost) * 100) / 100;
      summerMidPeakCost =
        Math.round((summerMidPeakCost + summerCost) * 100) / 100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost + nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round((nonsummerOffPeakCost + nonsummerCost) * 100) / 100;
    }
    summerFixedTotalCost = summerTotalCost.toFixed(2);
    $("#summerCost").html("$" + summerFixedTotalCost);
    $("#summerMidPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerMidPeakCircle")
      .find(".circleCost")
      .text("$" + summerMidPeakCost.toFixed(2));
    nonsummerFixedTotalCost = nonsummerTotalCost.toFixed(2);
    $("#nonsummerCost").html("$" + nonsummerFixedTotalCost);
    $("#nonsummerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerOffPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerOffPeakCost.toFixed(2));
    if (nonsummerOffPeakCounter != 0) {
      $("#nonsummerOffPeakCircle").addClass("active");
    } else {
      $("#nonsummerOffPeakCircle").removeClass("active");
    }
    if (summerMidPeakCounter != 0) {
      $("#summerMidPeakCircle").addClass("active");
    } else {
      $("#summerMidPeakCircle").removeClass("active");
    }
    flashCircle("night");
  } else {
    /*allDay*/ if (!active) {
      summerOffPeakCounter = 0;
      summerMidPeakCounter = 0;
      summerPeakCounter = 0;
      nonsummerOffPeakCounter = 0;
      nonsummerPeakCounter = 0;
      summerTotalCost = Math.round((summerTotalCost - summerCost) * 100) / 100;
      summerOffPeakCost =
        Math.round(
          (summerOffPeakCost - calculateCost("morning", 1, 12)) * 100
        ) / 100;
      summerMidPeakCost =
        Math.round(
          (summerMidPeakCost - calculateCost("afternoon", 1, 9)) * 100
        ) / 100;
      summerPeakCost =
        Math.round((summerPeakCost - calculateCost("evening", 1, 3)) * 100) /
        100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost - nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round(
          (nonsummerOffPeakCost - calculateCost("morning", 0, 21)) * 100
        ) / 100;
      nonsummerPeakCost =
        Math.round((nonsummerPeakCost - calculateCost("evening", 0, 3)) * 100) /
        100;
    } else {
      summerOffPeakCounter = 1;
      summerMidPeakCounter = 2;
      summerPeakCounter = 1;
      nonsummerOffPeakCounter = 3;
      nonsummerPeakCounter = 1;
      summerTotalCost = Math.round((summerTotalCost + summerCost) * 100) / 100;
      summerOffPeakCost =
        Math.round(
          (summerOffPeakCost + calculateCost("morning", 1, 12)) * 100
        ) / 100;
      summerMidPeakCost =
        Math.round(
          (summerMidPeakCost + calculateCost("afternoon", 1, 9)) * 100
        ) / 100;
      summerPeakCost =
        Math.round((summerPeakCost + calculateCost("evening", 1, 3)) * 100) /
        100;
      nonsummerTotalCost =
        Math.round((nonsummerTotalCost + nonsummerCost) * 100) / 100;
      nonsummerOffPeakCost =
        Math.round(
          (nonsummerOffPeakCost + calculateCost("morning", 0, 21)) * 100
        ) / 100;
      nonsummerPeakCost =
        Math.round((nonsummerPeakCost + calculateCost("evening", 0, 3)) * 100) /
        100;
    }
    summerFixedTotalCost = summerTotalCost.toFixed(2);
    $("#summerCost").html("$" + summerFixedTotalCost);
    $("#summerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerOffPeakCircle")
      .find(".circleCost")
      .text("$" + summerOffPeakCost.toFixed(2));
    $("#summerMidPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerMidPeakCircle")
      .find(".circleCost")
      .text("$" + summerMidPeakCost.toFixed(2));
    $("#summerPeakCircle").find(".circleCost").css("opacity", 1);
    $("#summerPeakCircle")
      .find(".circleCost")
      .text("$" + summerPeakCost.toFixed(2));
    nonsummerFixedTotalCost = nonsummerTotalCost.toFixed(2);
    $("#nonsummerCost").html("$" + nonsummerFixedTotalCost);
    $("#nonsummerOffPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerOffPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerOffPeakCost.toFixed(2));
    $("#nonsummerPeakCircle").find(".circleCost").css("opacity", 1);
    $("#nonsummerPeakCircle")
      .find(".circleCost")
      .text("$" + nonsummerPeakCost.toFixed(2));
    if (nonsummerOffPeakCounter != 0) {
      $("#nonsummerOffPeakCircle").addClass("active");
    } else {
      $("#nonsummerOffPeakCircle").removeClass("active");
    }
    if (summerOffPeakCounter != 0) {
      $("#summerOffPeakCircle").addClass("active");
    } else {
      $("#summerOffPeakCircle").removeClass("active");
    }
    if (summerMidPeakCounter != 0) {
      $("#summerMidPeakCircle").addClass("active");
    } else {
      $("#summerMidPeakCircle").removeClass("active");
    }
    if (nonsummerPeakCounter != 0) {
      $("#nonsummerPeakCircle").addClass("active");
    } else {
      $("#nonsummerPeakCircle").removeClass("active");
    }
    if (summerPeakCounter != 0) {
      $("#summerPeakCircle").addClass("active");
    } else {
      $("#summerPeakCircle").removeClass("active");
    }
    flashCircle(timeId);
  }
  removeAnimation();
  if (summerFixedTotalCost == 0) {
    $(".costInfo").css("opacity", 0.2);
  } else {
    $(".costInfo").css("opacity", 1);
  }
}
function removeAnimation() {
  if (summerOffPeakCost == 0) {
    $("#summerOffPeakCircle").find(".circleCost").css("opacity", 0.2);
    $("#summerOffPeakCircle").removeClass("animateOffPeak");
  }
  if (nonsummerOffPeakCost == 0) {
    $("#nonsummerOffPeakCircle").find(".circleCost").css("opacity", 0.2);
    $("#nonsummerOffPeakCircle").removeClass("animateOffPeak");
  }
  if (summerMidPeakCost == 0) {
    $("#summerMidPeakCircle").find(".circleCost").css("opacity", 0.2);
    $("#summerMidPeakCircle").removeClass("animateMidPeak");
  }
  if (summerPeakCost == 0) {
    $("#summerPeakCircle").find(".circleCost").css("opacity", 0.2);
    $("#summerPeakCircle").removeClass("animatePeak");
  }
  if (nonsummerPeakCost == 0) {
    $("#nonsummerPeakCircle").find(".circleCost").css("opacity", 0.2);
    $("#nonsummerPeakCircle").removeClass("animatePeak");
  }
}
function flashCircle(timeId) {
  if ($(".timePeriod." + timeId).find(".check.active").length != 0) {
    if (timeId == "morning") {
      $("#nonsummerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#nonsummerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
      $("#summerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#summerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
    } else if (timeId == "afternoon") {
      $("#nonsummerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#nonsummerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
      $("#summerMidPeakCircle").removeClass("animateMidPeak");
      setTimeout(function () {
        $("#summerMidPeakCircle").addClass("animateMidPeak");
      }, 200);
    } else if (timeId == "evening") {
      $("#nonsummerPeakCircle").removeClass("animatePeak");
      setTimeout(function () {
        $("#nonsummerPeakCircle").addClass("animatePeak");
      }, 200);
      $("#summerPeakCircle").removeClass("animatePeak");
      setTimeout(function () {
        $("#summerPeakCircle").addClass("animatePeak");
      }, 200);
    } else if (timeId == "night") {
      $("#nonsummerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#nonsummerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
      $("#summerMidPeakCircle").removeClass("animateMidPeak");
      setTimeout(function () {
        $("#summerMidPeakCircle").addClass("animateMidPeak");
      }, 200);
    } else {
      $("#nonsummerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#nonsummerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
      $("#summerOffPeakCircle").removeClass("animateOffPeak");
      setTimeout(function () {
        $("#summerOffPeakCircle").addClass("animateOffPeak");
      }, 200);
      $("#summerMidPeakCircle").removeClass("animateMidPeak");
      setTimeout(function () {
        $("#summerMidPeakCircle").addClass("animateMidPeak");
      }, 200);
      $("#nonsummerPeakCircle").removeClass("animatePeak");
      setTimeout(function () {
        $("#nonsummerPeakCircle").addClass("animatePeak");
      }, 200);
      $("#summerPeakCircle").removeClass("animatePeak");
      setTimeout(function () {
        $("#summerPeakCircle").addClass("animatePeak");
      }, 200);
    }
  }
}

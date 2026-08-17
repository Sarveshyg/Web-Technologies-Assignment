(function () {
  "use strict";

  var SLABS = [
    { limit: 50, rate: 3.50 },
    { limit: 100, rate: 4.00 },
    { limit: 100, rate: 5.20 },
    { limit: Infinity, rate: 6.50 }
  ];

  var form = document.getElementById("billForm");
  var nameInput = document.getElementById("name");
  var unitsInput = document.getElementById("units");
  var nameErr = document.getElementById("nameErr");
  var unitsErr = document.getElementById("unitsErr");
  var estimate = document.getElementById("estimate");

  function calculateBill(units) {
    var remaining = units;
    var total = 0;
    for (var i = 0; i < SLABS.length && remaining > 0; i++) {
      var used = Math.min(remaining, SLABS[i].limit);
      total += used * SLABS[i].rate;
      remaining -= used;
    }
    return total;
  }

  function formatINR(value) {
    return "\u20B9" + value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
  }

  var params = new URLSearchParams(window.location.search);
  var error = params.get("error");
  if (error) {
    showToast(decodeURIComponent(error));
  }

  unitsInput.addEventListener("input", function () {
    var value = parseFloat(unitsInput.value);
    if (!isNaN(value) && value >= 0) {
      estimate.textContent = formatINR(calculateBill(value));
    } else {
      estimate.textContent = formatINR(0);
    }
  });

  form.addEventListener("submit", function (event) {
    var valid = true;
    nameErr.textContent = "";
    unitsErr.textContent = "";

    if (!nameInput.value.trim()) {
      nameErr.textContent = "Consumer name is required.";
      valid = false;
    }

    var units = parseFloat(unitsInput.value);
    if (unitsInput.value.trim() === "" || isNaN(units)) {
      unitsErr.textContent = "Units must be a valid number.";
      valid = false;
    } else if (units < 0) {
      unitsErr.textContent = "Units cannot be negative.";
      valid = false;
    }

    if (!valid) {
      event.preventDefault();
    }
  });
})();
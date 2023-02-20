$(document).ready(function () {
  $("#fromDate")
    .datepicker({
      format: "dd-mm-yyyy",
      autoclose: true,
    })
    .on("changeDate", function (selected) {
      var date_selected = new Date(selected.date.valueOf());
      $("#toDate").datepicker("setStartDate", date_selected);
    });
  $("#toDate")
    .datepicker({
      format: "dd-mm-yyyy",
      autoclose: true,
    })
    .on("changeDate", function (selected) {
      var date_selected = new Date(selected.date.valueOf());
      $("#fromDate").datepicker("setEndDate", date_selected);
    });
});

$(".readonly").on('keydown paste focus mousedown', function(e){
  if(e.keyCode != 9) // ignore tab
      e.preventDefault();
});

function getDays() {
  startDate = $("#fromDate").datepicker("getDate");
  endDate = $("#toDate").datepicker("getDate");

  if ((startDate == null) & (endDate == null)) alert("กรุณาเลิอกวันที่");

  var milli_secs = startDate.getTime() - endDate.getTime();
  // Convert the milli seconds to Days
  var days = milli_secs / (1000 * 3600 * 24);
  console.log(days);
  document.getElementById(
    "diffdays"
  ).value = `${Math.round(Math.abs(days))} วัน`;

  totaldays = Math.round(Math.abs(days));

  var package = document.getElementById("package-select").value;
  console.log(package);

  var price = 0;

  if (totaldays == 0) {
    totaldays = 1
  }

  if (package == 'Single_room') price = 250 * totaldays;
  else if (package == 'Standard_room') price = 350 * totaldays;
  else if (package == 'Family_room') price = 650 * totaldays;
  else if (package == 'The_Biggest_room') price = 850 * totaldays;

  var discounted_price = 0;

  if ((totaldays >= 10) & (totaldays < 20))
    discounted_price = price - (price * 10) / 100;
  else if ((totaldays >= 20) & (totaldays < 30) & (package != 'The_Biggest_room'))
    discounted_price = price - (price * 20) / 100;
  else if ((totaldays >= 20) & (totaldays < 30) & (package == 'The_Biggest_room'))
    discounted_price = price - (price * 15) / 100;
  else if ((totaldays >= 30) & (package != 4))
    discounted_price = price - (price * 40) / 100;
  else if ((totaldays >= 30) & (package == 4))
    discounted_price = price - (price * 25) / 100;
  else
    discounted_price = price

  console.log(discounted_price);
  document.getElementById("price").value = `${discounted_price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} บาท`;
}
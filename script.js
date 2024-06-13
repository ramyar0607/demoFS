function getToStep1() {
  $("#start-page").hide();
  $("#step-1").show();
}



/*** start 1 of 4 ***/

function checkPlaceholder() {
  var select = document.getElementById("mySelect");
  if (select.value === "") {
    select.style.color = "#999"; // Change placeholder color if selected
  } else {
    select.style.color = "#000"; // Change text color if an option is selected
  }
}

function toggleDropDown() {
  var customSelect = document.getElementById("customSelect");
  if (customSelect.classList.contains("dropdown-open")) {
    customSelect.classList.remove("dropdown-open");
  } else {
    customSelect.classList.add("dropdown-open");
  }
}

/*****************************/
function sendMail() {
  // var params = {
  //   name: document.getElementById("name").value,
  //   email: document.getElementById("email").value,
  //   //message: document.getElementById("message").value,
  //   Total_Cost: document.getElementById("Total_Cost").value,
  //   Project_Cost: document.getElementById("Project_Cost").value,
  // };
  var data = {
    service_id: 'service_wecpcvr',
    template_id: 'template_b898665',
    user_id: 'hY-uM04iJ0vpwbIIH',
    template_params: {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      Total_Cost: document.getElementById("Total_Cost").value,
      Project_Cost: document.getElementById("Project_Cost").value,
    }
};
  // const serviceID = "service_wecpcvr";
  // const templateID = "template_b898665";

    // emailjs.send(serviceID, templateID, params)
    // .then(res=>{
    //     //document.getElementById("name").value = "";
    //     //document.getElementById("email").value = "";
    //    // document.getElementById("message").value = "";
    //     console.log(res);
    //     alert("Your message sent successfully!!")

    // })
    // .catch(err=>console.log(err));
    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    crossDomain: true,
}).done(function() {
    alert('Your mail is sent!');
}).fail(function(error) {
    alert('Oops... ' + JSON.stringify(error));
});
}




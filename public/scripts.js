import axios from 'https://cdn.skypack.dev/axios';



//!     Sidebar eventlistener for clicked effect
const sidebarItems = document.querySelectorAll('#sidebar-container ul li');
sidebarItems.forEach(item => {
    console.log('PRESSED BUTTON')
    item.addEventListener('click', () => {
        sidebarItems.forEach(item => {
            item.classList.remove('sidebar-clicked');
        });

        item.classList.add('sidebar-clicked');
    });
});

//! Tooltip requirment + check if can send form
var form = document.querySelector('form');
var inputs = document.querySelectorAll('.input-box input');

form.onsubmit = async function(e) {
    e.preventDefault();
    var allValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    inputs.forEach(function(input) {
        var tooltip = input.nextElementSibling;
        var listItems = tooltip.querySelectorAll('li');
        var value = input.value;

        if (input.name === 'password' || input.name === 'username'){
            listItems[0].style.color = (value.length >= 6 && value.length <= 15) ? 'black' : 'red';
        }
        if (input.name === 'password'){
            listItems[1].style.color = /[a-z]/.test(value) ? 'black' : 'red';
            listItems[2].style.color = /[A-Z]/.test(value) ? 'black' : 'red';
            listItems[3].style.color = /\d/.test(value) ? 'black' : 'red';
        }
        if (input.name === 'email'){
            listItems[0].style.color = emailPattern.test(value) ? 'black' : 'red';
        }
        // Check if any list item is red
        var inputValid = true;
        for (var i = 0; i < listItems.length; i++) {
            if (listItems[i].style.color === 'red') {
                inputValid = false;
                break;
            }
        }
        // If input is not valid, add shake class to tooltip
        if (!inputValid) {
            tooltip.style.display = "block";
            tooltip.classList.add('shake');
            // Remove shake class after animation ends
            setTimeout(function() {
                tooltip.classList.remove('shake');
            }, 500);
            allValid = false;
        }

    });
    // Check if user and email exist
    if(allValid){
        await checkUniqueness(e);
    }
};

async function checkUniqueness(e) {
    try {
        let response = await axios.post("/check-registration", {
            username: form.username.value,
            email: form.email.value
        });

        if (response.data.unique) {
            form.submit(); // Submit the form
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.my_message) {
            alert(error.response.data.my_message);
        } else {
            alert("An error occurred. Please try again later.");
        }
    }
}


//! Show Hide Tooltip 
inputs.forEach(function(input) {
    var tooltip = input.nextElementSibling;
    input.onfocus = function() {
        tooltip.style.display = "block";
    }
    input.onblur = function() {
        tooltip.style.display = "none";
    }
});



//omogoca delovanje dropdown menija
let dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
});

//boolean za preverjanje, ali je user logged in
var logged_in = false;
if (logged_in){
    document.getElementById('log-id').innerHTML = 'Log Out';
}

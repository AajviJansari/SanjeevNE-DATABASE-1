// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function(){
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if(hamburger && navLinks){
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
  }
document.addEventListener('DOMContentLoaded', () => {

    const infoBox = document.getElementById('info-box');
    const states = document.querySelectorAll('#northeast-map path');

    // This makes sure the info-box doesn't get stuck if the mouse leaves the window
    document.body.addEventListener('mouseleave', () => {
        infoBox.style.display = 'none';
    });

    states.forEach(state => {
        // When the mouse enters a state's path
        state.addEventListener('mouseover', (event) => {
            // Get the state name from the 'data-name' attribute
            const stateName = state.dataset.name;
            
            // Update the info box's text and make it visible
            infoBox.textContent = stateName;
            infoBox.style.display = 'block';
        });

        // When the mouse moves over a state
        state.addEventListener('mousemove', (event) => {
            // Position the info box near the cursor
            // The +15 offset prevents the box from flickering by being directly under the cursor
            infoBox.style.left = `${event.pageX + 15}px`;
            infoBox.style.top = `${event.pageY + 15}px`;
        });

        // When the mouse leaves a state's path
        state.addEventListener('mouseout', () => {
            // Hide the info box
            infoBox.style.display = 'none';
        });
        
    });
});
  



});
    

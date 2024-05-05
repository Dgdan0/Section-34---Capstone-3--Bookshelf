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
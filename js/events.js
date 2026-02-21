$(document).on('click', '.cell', function (e) {
    let x = Number(e.target.id.split('-')[1]);
    let y = Number(e.target.id.split('-')[2]);
    juego.input.click(x, y);
    ui.refresh();
});

$(document).on('click', '#restart', function (e) {
    juego.restart();
    ui.refresh();
});

$(document).on('contextmenu', ".fog", function (e) {
    // Prevent the default browser context menu from appearing
    event.preventDefault();
    let x = Number(e.target.id.split('-')[1]);
    let y = Number(e.target.id.split('-')[2]);
    let screen_x = e.pageX;
    let screen_y = e.pageY;
    ui.show_context_menu(screen_x, screen_y, x, y);



});

$(document).on('keydown', function (e) {
    // Modern way: check the key
    if (e.key === " " || e.key === "Spacebar") {
        juego.input.spacebar();
    }
    ui.refresh();
});

for (let button of document.querySelectorAll('button')) {
    button.addEventListener('click', function (e) {
        ui.refresh();
    });
}

window.addEventListener('click', function (e) {
    const menu = document.getElementById('context-menu');
    // Check if menu is visible and the click is NOT inside the menu
    if (menu.style.display === 'block' && !menu.contains(e.target)) {
        // Stop the event from reaching other elements (like cells)
        e.stopPropagation();
        e.preventDefault();
        ui.hide_context_menu();
    }
}, true); // UseCapture = true to catch event before it bubbles
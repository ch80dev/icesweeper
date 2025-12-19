class Input {
    click(x, y) {

        if (juego.map.at(x, y) < 0) {
            juego.chinga_la_migra(x, y);
        }

        if (juego.map.is_fog_here(x, y)) {
            juego.map.fog[x][y] = false;
            juego.map.reveal(x, y);
            return;
        }

        if (juego.map.at(x, y) > 0) {
            juego.help(x, y);
            return;
        }

    }

    plant_flag_from_menu(x, y, id) {
        juego.plant_flag(x, y, id);
        ui.hide_context_menu();
        ui.refresh();
    }
    right_click(x, y) {
        juego.plant_flag(x, y);

    }
}
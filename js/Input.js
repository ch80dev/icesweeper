class Input {
    click(x, y) {

        if (juego.map.at(x, y) < 0) {
            juego.chinga_la_migra(x, y);
            juego.sounds.ice.play();
        }

        if (juego.map.is_fog_here(x, y)) {

            juego.sounds.reveal[rand_num(1, 3)].play();
            juego.map.fog[x][y] = false;
            juego.map.reveal(x, y);
            return;
        }

        if (juego.map.at(x, y) > 0) {
            juego.sounds.alien[rand_num(1, 4)].play();
            juego.help(x, y);
            return;
        }

    }

    plant_flag_from_menu(x, y, id) {
        juego.sounds.reveal[4].play();

        juego.plant_flag(x, y, id);
        ui.hide_context_menu();
        ui.refresh();
    }
    right_click(x, y) {

        juego.plant_flag(x, y);

    }
}
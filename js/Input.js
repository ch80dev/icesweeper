class Input {
    click(x, y) {
        if (!juego.never_touched_ice_before && !juego.never_helped){
            ui.next_new_tooltip();
        }
        juego.last_pressed  = { x: x, y: y };
        if (juego.map.at(x, y) < 0) {
            juego.chinga_la_migra(x, y);
            juego.sounds.ice.play();
        }

        if (juego.map.is_fog_here(x, y)) {
            if (!juego.never_helped){
                ui.next_new_tooltip();
            }
            juego.sounds.reveal[rand_num(1, 3)].play();
            juego.map.fog[x][y] = false;
            // Only flood-fill reveal empty cells (null). Numbers should only uncover themselves.
            if (juego.map.at(x, y) === null) {
                juego.map.reveal(x, y);
            }
            return;
        }

        if (juego.map.at(x, y) > 0) {            
            if(juego.sounds.gente){
				juego.sounds.gente.pause();
				juego.sounds.gente.currentTime = 0;
			}
            juego.sounds.gente.play();
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
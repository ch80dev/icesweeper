class UI {
	constructor() {

	}

	show_context_menu(screen_x, screen_y, cell_x, cell_y) {
		this.create_context_menu(cell_x, cell_y);
		const menu = document.getElementById('context-menu');
		menu.style.display = 'block';
		menu.style.left = screen_x + 'px';
		menu.style.top = screen_y + 'px';
	}

	hide_context_menu() {
		const menu = document.getElementById('context-menu');
		menu.style.display = 'none';
	}

	create_context_menu(x, y) {
		let txt = `<li class="context-menu__item" onclick="juego.input.plant_flag_from_menu(${x}, ${y}, null)"></li>`;
		for (let i in Config.flags) {
			let flag = Config.flags[i];
			txt += `<li class="context-menu__item" onclick="juego.input.plant_flag_from_menu(${x}, ${y}, ${i})">${flag}</li>`;
		}
		$(".context-menu__items").html(txt);
	}

	display_map() {
		let txt = "";
		for (let y = 0; y < Config.max_y; y++) {
			//txt += "<div class='row'>"
			for (let x = 0; x < Config.max_x; x++) {
				let cell_class = "";
				let cell_txt = "";
				let fog_here = juego.map.is_fog_here(x, y);
				let num_of_adjacent_aliens = juego.map.fetch_num_of_adjacent(x, y, true);
				let num_of_adjacent_ice = juego.map.fetch_power_of_adjacent(x, y, false);
				if (fog_here || juego.reveal_off) {
					cell_class = ' fog '
				} else if (juego.map.at(x, y) < 0) {
					cell_class = " ice ";
					cell_txt = "🐖";
				} else if (juego.map.at(x, y) > 0) {
					cell_class = " alien ";
				}
				if (juego.map.fog[x][y] && juego.map.flag[x][y]) {
					cell_txt = juego.map.flag[x][y];
				} else if (!fog_here && juego.map.at(x, y) > 0) {
					cell_txt = "🇲🇽";
				} else if ((!fog_here && num_of_adjacent_ice > 0) && juego.map.at(x, y) >= 0) {
					cell_txt = num_of_adjacent_ice;
				} else if ((!fog_here && num_of_adjacent_ice > 0 && num_of_adjacent_aliens > 0)) {
					//cell_txt = num_of_adjacent_ice - num_of_adjacent_aliens;
					//cell_class = ' both ';
				}


				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}'>
					${cell_txt}
					</div>`

			}
			//txt += "</div>"
		}
		document.getElementById('map').innerHTML = txt;
	}

	refresh() {
		$("#compas").html(juego.compas);
		if (juego.compas_lost > 0) {
			$("#compas").html(juego.compas + ` (<span class='lost'>-${juego.compas_lost}</span>)`);
		} else if (juego.compas_lost < 0) {
			$("#compas").html(juego.compas + ` (<span class='help'>+${Math.abs(juego.compas_lost)}</span>)`);
		}
		$("#compas_remaining").html(Config.num_of_aliens - juego.aliens_found);

		this.display_map();
	}
}

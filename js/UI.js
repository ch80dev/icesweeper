class UI {
	constructor() {

	}
	flash(compa_delta){
		$("#compa_delta").removeClass('hidden');
		
		if (compa_delta > 0) {
			$("#compa_delta").html("-" + compa_delta);
			$("#compa_delta").removeClass("help");
			$("#compa_delta").addClass("lost");
		} else if (compa_delta < 0) {
			$("#compa_delta").html("+" + Math.abs(compa_delta));
			$("#compa_delta").removeClass("lost");
			$("#compa_delta").addClass("help");
		}
		
		setTimeout(function(){
			$("#compa_delta").addClass('hidden');
		}, Config.flash_time);
	}

	lose(){
		//$("#game").addClass('hidden');
		// first phase: text fades in over the game
		$("#defeat").addClass('show-text');
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
			for (let x = 0; x < Config.max_x; x++) {
				let cell_class = "";
				let icon = "";
				let fog_here = juego.map.is_fog_here(x, y);
				let num_of_adjacent_gente = juego.map.fetch_num_of_adjacent(x, y, true);
				let num_of_adjacent_ice = juego.map.fetch_power_of_adjacent(x, y, false);
				let number = "";
				if (fog_here && !juego.reveal) {
					cell_class = ' fog '
				} else if (juego.map.at(x, y) < 0) {
					cell_class = " ice ";
					icon = "🐖";
				} else if (juego.map.at(x, y) > 0) {
					cell_class = " gente ";
				}

				if (juego.map.fog[x][y] && juego.map.flag[x][y]) {
					number = juego.map.flag[x][y];
				} else if ((!fog_here || fog_here && juego.reveal) && juego.map.at(x, y) > 0) {
					icon = juego.map.gente_flags[x][y];
					number = juego.map.at(x, y);
				} else if ((!fog_here && num_of_adjacent_ice > 0) && juego.map.at(x, y) >= 0) {
					number = num_of_adjacent_ice;

				}
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}' data-icon='${icon}' data-num='${number}'>
				
					</div>`
			}
		}
		document.getElementById('map').innerHTML = txt;
	}

	refresh() {
		$("#compas").html(juego.compas);
		if (juego.compas_lost != 0){
			this.flash(juego.compas_lost);		
		}		
		juego.compas_lost = 0;
		$("#compas_remaining").html(Config.num_of_gente - juego.gente_found);
		if (juego.wins > 0){
			$("#wins").html("Wins: " + juego.wins);
		}
		this.display_map();
	}	

	restart(){
		$("#game").removeClass('hidden');
		$(".screen").removeClass('fade-screen show-text visible');
	}
	win(){
		$("#game").addClass('hidden');
		$("#victory").addClass('visible');
	}
}

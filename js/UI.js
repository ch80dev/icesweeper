class UI {
	tooltip_id = 0;
	tooltips_new = [];
	constructor() {
		for (let id in Config.tooltips){
			this.tooltips_new.push(true);
		}
	}

	change_tooltip(what){		
		let delta = 0;
		if (what == 'prev' && this.tooltip_id != 0){
			delta = -1;
		} else if (what == 'next' && this.tooltip_id != Config.tooltips.length - 1){
			delta = 1;
		}
		this.tooltip_id += delta;		
	}

	close_tooltips(){
		$("#tooltips").addClass('hidden');
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
		const mapEl = document.getElementById('map');
		if (mapEl) {
			mapEl.style.setProperty('--cols', Config.max_x);
			mapEl.style.setProperty('--rows', Config.max_y);
		}
		let txt = "";
		for (let y = 0; y < Config.max_y; y++) {
			for (let x = 0; x < Config.max_x; x++) {
				let cell_class = "";
				let icon = "";
				let fog_here = juego.map.is_fog_here(x, y);
				let num_of_adjacent_gente = juego.map.fetch_num_of_adjacent(x, y, true);
				let num_of_adjacent_ice = juego.map.fetch_power_of_adjacent(x, y, false);
				let number = "";
				
					
				if (juego.map.fog != false && !juego.reveal && juego.map.fog[x][y] == -1) {
					cell_class = ' wrong ';
				} else if (fog_here && !juego.reveal) {
					cell_class = ' fog ';
				} else if (juego.map.at(x, y) < 0) {
					cell_class = " ice ";
					icon = "🐖";
				} else if (juego.map.at(x, y) > 0) {
					cell_class = " gente ";
				}

				if (juego.map.fog[x][y] && juego.map.flag[x][y] != false && juego.map.flag[x][y] >= 0) {
					number = juego.map.flag[x][y];
				} else if ((!fog_here || fog_here && juego.reveal) && juego.map.at(x, y) > 0) {
					icon = juego.map.gente_flags[x][y];
					number = juego.map.at(x, y);
				} else if ((!fog_here && num_of_adjacent_ice > 0) && juego.map.at(x, y) >= 0) {
					number = num_of_adjacent_ice;

				}
				if (juego.last_pressed != null && juego.last_pressed.x == x && juego.last_pressed.y == y){
					cell_class += " pressed ";
				}
				txt += `<div id='cell-${x}-${y}' class='cell ${cell_class}' data-icon='${icon}' data-num='${number}'>
				
					</div>`
			}
		}
		document.getElementById('map').innerHTML = txt;
	}

	flash(compa_delta){
		//$("#compa_delta").removeClass('hidden');
		let txt = "";
		if (compa_delta > 0) {
			txt = "-" + compa_delta;
			$("#compa_delta").removeClass("help");
			$("#compa_delta").addClass("lost");
			
		} else if (compa_delta < 0) {
			txt = "+" + Math.abs(compa_delta);
			$("#compa_delta").removeClass("lost");
			$("#compa_delta").addClass("help");
		}
		console.log(txt);
		this.showDeltaText(document.getElementById("compa_delta"), txt, 2000);
		/*
		setTimeout(function(){
			$("#compa_delta").addClass('hidden');
		}, Config.flash_time);
		*/
	}

	lose(){
		//$("#game").addClass('hidden');
		// first phase: text fades in over the game
		$("#defeat").addClass('show-text');
	}
	next_new_tooltip(){
		for (let i = 0; i < this.tooltips_new.length; i ++){
			if (this.tooltips_new[i]){
				this.tooltip_id = i;
				break;
			}
		}
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

	

	refresh() {
		$("#compas").html(juego.compas);
		if (juego.compas_lost != 0){
			this.flash(juego.compas_lost);		
			
		}		
		juego.compas_lost = 0;
		$("#compas_remaining").html(Config.num_of_gente - juego.gente_found);
		if (juego.already_won && $("#wins").hasClass('hidden')){
			$("#wins").removeClass('hidden');
			$("#win_menu").removeClass('hidden');
		}
		$("#wins").html("Wins: " + juego.wins);

		$("#confirm").prop('disabled', false);
		if (juego.wins < 1){
			$("#confirm").prop('disabled', true);
		}
		this.display_map();

		$("#tooltip-text").html(`${Number(this.tooltip_id) + 1}/${Config.tooltips.length} ${Config.tooltips[this.tooltip_id]} `)
		$("#tooltip-text").removeClass('new');
		if (this.tooltips_new[this.tooltip_id]){
			$("#tooltip-text").addClass('new');
			this.tooltips_new[this.tooltip_id] = false;
		}
		$("#prev-tooltip").prop('disabled', false);
		$("#next-tooltip").prop('disabled', false);
		if (this.tooltip_id == 0 ){
			$("#prev-tooltip").prop('disabled', true);
		} else if (this.tooltip_id == Config.tooltips.length - 1){
			$("#next-tooltip").prop('disabled', true);
		}
	}	

	restart(){
		$("#game").removeClass('hidden');
		$(".screen").removeClass('fade-screen show-text visible');
	}

	showDeltaText(el, text, duration = 1200) {
		// reset state if reused quickly
		el.classList.remove("fade-out");
		el.classList.remove("delta-pop");

		// force reflow so animation can restart
		void el.offsetWidth;

		// set content
		el.textContent = text;

		// allow CSS duration control
		el.style.setProperty("--fade-time", duration + "ms");

		// show
		el.classList.add("delta-pop");

		// start fade slightly after appearing
		setTimeout(() => {
			el.classList.add("fade-out");
		}, 20);

		// cleanup after animation finishes
		setTimeout(() => {
			el.textContent = "";
			el.classList.remove("delta-pop", "fade-out");
		}, duration);
	}

	win(){
		$("#game").addClass('hidden');
		$("#victory").addClass('visible');
	}
}

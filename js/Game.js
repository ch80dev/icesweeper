class Game {
	gente_found = 0;
	compas = 0;
	compas_lost = 0;
	flagging = false;
	fog_visible = null;
	input = new Input();
	loop = new Loop();
	map = new GameMap(Config.max_x, Config.max_y);
	player = new Player();
	reveal = false;
	sounds  = 
	{
		gente: [],
		defeat: new Audio("audio/defeat.mp3"),
		ice: new Audio("audio/ice.wav"),
		reveal: [],
		victory: new Audio("audio/victory.mp3"),
	
	}
	wins = 0;
	
	constructor() {
		setInterval(() => this.loop.go(), Config.loop_interval_timing);
		for (let i = 1; i <= 4; i ++){
			this.sounds.gente[i] = new Audio(`audio/alien-${i}.mp3`);
			this.sounds.reveal[i] = new Audio(`audio/reveal-${i}.mp3`);
		}		
	}
	chinga_la_migra(x, y) {
		if (this.map.at(x, y) > 0) {
			return;
		}
		this.compas_lost = Math.abs(this.map.at(x, y));
		this.compas += this.map.at(x, y);
		this.map.is(x, y, null);
		if (this.compas  < 0){
			this.reveal = true;
			this.sounds.defeat.play();
			ui.lose();
		}
	}

	help(x, y) {
		if (this.map.at(x, y) <= 0) {
			return;
		}
		this.compas_lost -= this.map.at(x, y);
		this.gente_found++;
		this.compas += this.map.at(x, y);
		this.map.is(x, y, null);

		if (this.gente_found >= Config.num_of_gente) {
			this.sounds.victory.play();
			ui.win();
			this.wins ++;
		}

	}

	plant_flag(x, y, id) {
		if (id == null) {
			this.map.flag[x][y] = false;
			return;
		}
		this.map.flag[x][y] = Config.flags[id];
	}

	restart(player_loses){
		
		this.map.restart(Config.max_x, Config.max_y);
		this.gente_found = 0;
		this.compas = 0;
		this.compas_lost = 0;
		this.wins = 0;
		if(player_loses){
			this.reveal = false;
		}
		ui.restart();

		
	}
}

class Game {
	aliens_found = 0;
	compas = 0;
	compas_lost = 0;
	flagging = false;
	input = new Input();
	loop = new Loop();
	map = new GameMap(Config.max_x, Config.max_y);
	player = new Player();
	sounds  = 
	{
		alien: [],
		defeat: new Audio("audio/defeat.mp3"),
		ice: new Audio("audio/click.wav"),
		reveal: [],
		victory: new Audio("audio/victory.mp3"),
	
	}

	reveal_off = false;
	constructor() {
		// pass a function reference to setInterval instead of invoking immediately
		setInterval(() => this.loop.go(), Config.loop_interval_timing);
		for (let i = 0; i <= 4; i ++){
			this.sounds.alien[i] = new Audio(`audio/alien-${i}.mp3`);
			this.sounds.reveal[i] = new Audio(`audio/reveal-${i}.mp3`);
		}

		
	}
	chinga_la_migra(x, y) {
		if (this.map.at(x, y) > 0) {
			return;
		}

		juego.compas_lost = Math.abs(this.map.at(x, y));
		this.compas += this.map.at(x, y);
		this.map.is(x, y, null);
		this.sounds.defeat.play();
		ui.lose();
	}

	help(x, y) {
		if (this.map.at(x, y) <= 0) {
			return;
		}
		this.compas_lost -= this.map.at(x, y);
		this.aliens_found++;
		this.compas += this.map.at(x, y);
		this.map.is(x, y, null);

		if (this.aliens_found >= Config.num_of_aliens) {
			window.alert("YOU WON! SI SE PUEDE");
		}

	}

	plant_flag(x, y, id) {
		if (id == null) {
			this.map.flag[x][y] = false;
			return;
		}
		this.map.flag[x][y] = Config.flags[id];
	}

	restart(){
		this.map.restart(Config.max_x, Config.max_y);
		this.aliens_found = 0;
		this.compas = 0;
		this.compas_lost = 0;
		ui.restart();
	}
}

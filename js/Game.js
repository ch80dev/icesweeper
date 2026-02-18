class Game {
	aliens_found = 0;
	compas = 0;
	compas_lost = 0;
	flagging = false;
	input = new Input();
	loop = new Loop();
	map = new GameMap(Config.max_x, Config.max_y);
	player = new Player();

	reveal_off = false;
	constructor() {
		// pass a function reference to setInterval instead of invoking immediately
		setInterval(() => this.loop.go(), Config.loop_interval_timing);
	}
	chinga_la_migra(x, y) {
		if (this.map.at(x, y) > 0) {
			return;
		}

		juego.compas_lost = Math.abs(this.map.at(x, y));
		this.compas += this.map.at(x, y);
		this.map.is(x, y, null);
		if (this.compas < 0) {
			window.alert("CHINGA LA MIGRA");
		}
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
}

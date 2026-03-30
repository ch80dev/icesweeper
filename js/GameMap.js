class GameMap {
    flag = [];
    gente_flags = [];
    fog = [];
    grid = [];

    constructor(max_x, max_y) {
        this.restart(max_x, max_y);
    }

    at(x, y) {
        return this.grid[x][y];
    }

    confirm(){
        if (juego.wins < 1){
            return;
        }
        juego.wins --;
        console.log(juego.wins);
        for (let x = 0; x < Config.max_x; x ++){
            for (let y = 0; y < Config.max_y; y ++){
                if (this.flag[x][y] == false){
                    continue;
                }
                if (Number(this.flag[x][y]) != Math.abs(this.at(x, y))){
                    this.fog[x][y] = -1;
                }
            }
        }
    }

    create_start() {
        let max_open_spaces = 0;
        let border = null;
        let border_x = [0, Config.max_x - 1];
        let border_y = [0, Config.max_y - 1];
        for (let x of border_x) {
            for (let y = 0; y < Config.max_y - 1; y++) {
                if (this.at(x, y) != null) {
                    continue;
                }
                let open_spots = this.fetch_all_open_spots(x, y);
                if (open_spots.length > max_open_spaces) {
                    border = { x: x, y: y };
                    max_open_spaces = open_spots.length;
                }
            }
        }
        for (let x = 0; x < Config.max_x; x++) {
            for (let y of border_y) {
                if (this.at(x, y) != null) {
                    continue;
                }
                let open_spots = this.fetch_all_open_spots(x, y);
                if (open_spots.length > max_open_spaces) {
                    border = { x: x, y: y };
                    max_open_spaces = open_spots.length;
                }
            }
        }
        this.reveal(border.x, border.y);

        this.reveal_neighbors(border.x, border.y);
    }

    reveal_neighbors(x, y) {
        let open_spots = this.fetch_all_open_spots(x, y);
        for (let spot of open_spots) {
            let neighbors = [
                { x: spot.x + 1, y: spot.y },
                { x: spot.x - 1, y: spot.y },
                { x: spot.x, y: spot.y + 1 },
                { x: spot.x, y: spot.y - 1 }
            ];
            for (let n of neighbors) {
                if (this.is_valid(n.x, n.y) && this.at(n.x, n.y) > 0) {
                    this.fog[n.x][n.y] = false;
                }
            }
        }
    }


    fetch_distance(from_x, from_y, to_x, to_y) {
        return Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2))
    }

    fetch_num_of_adjacent(start_x, start_y, gente_search) {
        let n = 0;
        let value = -1;
        if (gente_search) {
            value = 1;
        }
        for (let x = start_x - 1; x <= start_x + 1; x++) {
            for (let y = start_y - 1; y <= start_y + 1; y++) {
                if (!this.is_valid(x, y) || (x == start_x && y == start_y)) {
                    continue;
                }
                if (this.at(x, y) == value) {
                    n++;
                }
            }
        }
        return n;
    }

    fetch_power_of_adjacent(start_x, start_y, gente_search) {
        let n = 0;
        for (let x = start_x - 1; x <= start_x + 1; x++) {
            for (let y = start_y - 1; y <= start_y + 1; y++) {
                if (!this.is_valid(x, y) || (x == start_x && y == start_y)) {
                    continue;
                }
                if ((gente_search && this.at(x, y) > 0) || (!gente_search && this.at(x, y) < 0)) {
                    n += this.at(x, y);
                }
            }
        }
        return Math.abs(n);
    }

    has_adjacent_ice(start_x, start_y) {
        for (let x = start_x - 1; x <= start_x + 1; x++) {
            for (let y = start_y - 1; y <= start_y + 1; y++) {
                if (!this.is_valid(x, y) || (x == start_x && y == start_y)) {
                    continue;
                }
                if (this.at(x, y) < 0) {
                    return true;
                }
            }
        }
        return false;
    }

    fetch_all_open_spots(x, y, open_spots) {
        let prev_open_spots = [{ x: x, y: y }];
        let new_open_spots = [];
        if (open_spots != null) {
            prev_open_spots = open_spots;
        }
        let spots = this.fetch_open_spots(x, y, true);
        for (let i = spots.length - 1; i >= 0; i--) {
            let new_open = spots[i];
            for (let prev_open of prev_open_spots) {
                if (new_open.x == prev_open.x && new_open.y == prev_open.y) {
                    spots.splice(i, 1);
                }
            }
        }
        prev_open_spots = prev_open_spots.concat(spots);
        for (let spot of spots) {
            prev_open_spots = this.fetch_all_open_spots(spot.x, spot.y, prev_open_spots);
        }
        return prev_open_spots;



    }

    fetch_open_spots(start_x, start_y, orthogonal) {
        let open = [];
        for (let x = start_x - 1; x <= start_x + 1; x++) {
            for (let y = start_y - 1; y <= start_y + 1; y++) {
                if (!this.is_valid(x, y) || this.at(x, y) != null
                    || (x == start_x && y == start_y) || (orthogonal && x - start_x != 0 && y - start_y != 0)) {
                    continue;
                }

                open.push({ x: x, y: y });

            }
        }
        return open;

    }

    fetch_rand_open_spot() {
        while (1) {
            let rand_x = rand_num(0, Config.max_x - 1);
            let rand_y = rand_num(0, Config.max_y - 1);
            if (this.at(rand_x, rand_y) === null) {
                return { x: rand_x, y: rand_y };
            }
        }
    }

    generate() {
        let gente_generated = 0;
        while(gente_generated < Config.num_of_gente){
            let power = 1;
            let spot = this.fetch_rand_open_spot();
            let num_of_adjacent = this.fetch_num_of_adjacent(spot.x, spot.y, true);
            let are_they_mexican = rand_num(1, 2) == 1;
            let gente_flag = Config.gente_flags[0];
            if (!are_they_mexican){
                gente_flag = Config.gente_flags[rand_num(1, 5)];
            }
            if (num_of_adjacent == 0){
                this.is(spot.x, spot.y, power);
                this.gente_flags[spot.x][spot.y] = gente_flag;
                gente_generated++;
                
            }
            
        }
        
        let ice_generated = 0;
        let tries = 0;
        while (ice_generated < Config.num_of_ice && tries < Config.ice_spawn_max_tries) {
            let rand = rand_num(1, Math.floor(Config.ice_power / Config.num_of_ice * 2.5)); //could end up 0 hypothetically (like gente)
            let spot = this.fetch_rand_open_spot();
            if (Config.ice_no_adjacent && this.has_adjacent_ice(spot.x, spot.y)) {
                tries++;
                continue;
            }
            this.is(spot.x, spot.y, -rand);
            ice_generated++;
            tries++;
        }
        if (ice_generated < Config.num_of_ice) {
            let safety = 0;
            while (ice_generated < Config.num_of_ice && safety < Config.ice_spawn_max_tries) {
                let rand = rand_num(1, Math.floor(Config.ice_power / Config.num_of_ice * 2.5));
                let spot = this.fetch_rand_open_spot();
                this.is(spot.x, spot.y, -rand);
                ice_generated++;
                safety++;
            }
        }
        console.log(`ICE generated: ${ice_generated}/${Config.num_of_ice}`);

        
    }

    is_fog_here(x, y) {
        return this.fog[x][y];
    }

    is(x, y, what) {
        this.grid[x][y] = what;
    }

    is_valid(x, y) {
        return x >= 0 && x < Config.max_x && y >= 0 && y < Config.max_y;
    }

    restart(max_x, max_y){
        this.max_x = max_x;
        this.max_y = max_y;
        for (let x = 0; x < max_x; x++) {
            this.fog[x] = [];
            this.grid[x] = [];
            this.flag[x] = [];
            this.gente_flags[x] = [];
            for (let y = 0; y < max_y; y++) {
                this.flag[x][y] = false;
                this.fog[x][y] = Config.default_fog;
                this.gente_flags[x][y] = null;
                this.grid[x][y] = null;

            }
        }
        this.generate();
        this.create_start();
    }

    reveal(x, y) {
        // open the clicked spot plus all connected open spots
        let all_open_spots = this.fetch_all_open_spots(x, y);
        for (let spot of all_open_spots) {
            this.fog[spot.x][spot.y] = false;
        }

        // the following logic previously attempted to walk from the
        // revealed cell toward the center of the map, but it never
        // modified the game state and, when the starting cell was
        // exactly at the center, the deltas computed below were 0
        // which caused an infinite loop.  the loop served no purpose
        // in normal gameplay so it has been removed to avoid hangs.
    }
}

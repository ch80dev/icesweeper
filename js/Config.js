class Config {
	static gente_power = 7;
	static default_fog = true;
	static flags = [' ', '1', '2', '3', '4',];
	static gente_flags = ["🇲🇽", "🇸🇻", "🇬🇹", "🇭🇳", "🇻🇪", "🇨🇴"];
	static flash_time = 1000;
	static ice_power = 60;

	static loop_interval_timing = 1000;
	static max_x = 6;
	static max_y = 10;

	static num_of_ice = 30; 
	static num_of_gente = 10;
	static ice_no_adjacent = true;
	static ice_spawn_max_tries = 2000;

	static tooltips = [
		"Rescue 10 people (Gente/🇲🇽/🇭🇳) before your resolve runs out.",
		"Rescued people restore resolve (Poder).",
		"Numbers show total threat from ICE nearby, not agent count.",
		"ICE agents damage your resolve, but the struggle continues.",
		"Right-click (or hold down on mobile) to mark what you think is hidden here.",
		"You don’t need to clear the board — rescue enough to win",		
	];
	
}

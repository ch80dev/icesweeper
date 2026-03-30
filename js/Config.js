class Config {
	static gente_power = 15;
	static default_fog = true;
	static flags = [' ', '1', '2', '3', '4',];
	static gente_flags = ["🇲🇽", "🇸🇻", "🇬🇹", "🇭🇳", "🇻🇪", "🇨🇴"];
	static flash_time = 1000;
	static ice_power = 60;

	static loop_interval_timing = 1000;
	static max_x = 10;
	static max_y = 10;

	static num_of_ice = 45; //50 is difficult, 45 is consistently beatable for me. This means that is probably difficult for regular
	static num_of_gente = 15;

	static tooltips = [
		"Rescue 15 people (Gente/🇲🇽/🇭🇳) before your resolve runs out.",
		"Rescued people restore resolve (Poder).",
		"Numbers show the TOTAL threat value nearby — not the number of agents.",
		"ICE agents damage your resolve, but the struggle continues.",
		"Right-click (or hold down on mobile) to mark what you think is hidden here.",
		"You don’t need to clear the board — rescue enough to win",		
	];
	
}
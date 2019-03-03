/*
 ygopro-generate-result.js
 ygopro tournament result generator
 Author: Yuzurisa
 License: MIT
 
 Will generate the tournament result in a specific format.
*/

var output_path = "./config"
if (process.argv[2])
	output_path = process.argv[2];

const loadJSON = require('load-json-file').sync;
const fs = require('fs');
const settings = loadJSON('./config/config.json');
const challonge_config = settings.modules.challonge;
if (challonge_config.enabled) {
	challonge = require('challonge').createClient({
		apiKey: challonge_config.api_key
	});
} else { 
	console.error("Challonge is not enabled.");
	return 1;
}

var name_list = {};
var results = {};

console.log("Requesting player datas from Challonge.");
challonge.participants.index({
	id: challonge_config.tournament_id,
	callback: (error, data) => {
		if (error || !data) {
			console.error(error);
			return;
		}
		for (var k in data) {
			const player = data[k];
			if (!player || !player.participant) {
				continue;
			}
			const player_info = player.participant;
			const name = player_info.name;
			const id = player_info.id;
			name_list[id] = name;
		}
		console.log("Requesting match datas from Challonge.");
		//for (var i = 1; i <=)
		challonge.matches.index({
			id: challonge_config.tournament_id,
			callback: (error, data) => { 
				if (error || !data) { 
					console.error(error);
					return;
				}
				for (var k in data) {
					const match = data[k];
					if (!match || !match.match) {
						continue;
					}
					const match_info = match.match;
					if (match_info.state != "complete") {
						continue;
					}
					const sign = match_info.identifier;
					const round = match_info.round;
					const scores = match_info.scoresCsv;
					const scores_data = scores.split("-")
					if (!scores_data || scores_data.length != 2)
						continue;
					const player1 = match_info.player1Id;
					const player2 = match_info.player2Id;
					const match_txt = "[" + sign + "]组：\n  [1号]" + name_list[player1] + "    " + scores_data[0] + "\n  [2号]" + name_list[player2] + "    " + scores_data[1] + "\n";
					if (!results[round])
						results[round] = [];
					results[round].push(match_txt);
				}
				console.log("Request completed. Outputing data.")
				var player_text = "";
				for (var k in name_list) {
					player_text = player_text + name_list[k] + "\n";
				}
				fs.writeFileSync(output_path + "/player_list.txt", player_text);
				for (var k in results) {
					const round_data = results[k];
					var text = "";
					for (var k1 in round_data) {
						text = text + round_data[k1];
					}
					fs.writeFileSync(output_path + "/match_" + k + ".txt", text);
				}
				console.log("Finished.")
			}
		})
	}
})

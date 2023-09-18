import json

def generate_json(input_file, output_file):
	with open(output_file, 'a') as outfile:
		with open(input_file, 'r') as file:
			json_object = json.load(file)
			datas = []
			for object in json_object:
				data = {
					'video': object['Links'],
					'poster': None,
					'video_storage': 'extern',
					'poster_storage': None,
					'episode': object['Episode']
				}
				datas.append(data)
			json.dump(datas, outfile, indent=4)
			file.close()
		outfile.close()


if __name__ == "__main__":
	generate_json('./animes_csv_to_json.json', './anime.json')
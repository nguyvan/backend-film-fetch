import { MovieRepository } from "@/repositories/movie.repository";
import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { EpisodeRepository } from "@/repositories/episode.repository";
import { typeS3 } from "@/constants/type.constant";
import { S3Factory } from "@/services/file-storage/s3-factory";
import { typeMovie } from "@/types/movie/movie.type";

async function main() {
	const mongoDBConnection = new MongoDBConnection();
	const movieRepository = new MovieRepository(mongoDBConnection);
	const episodeRepository = new EpisodeRepository(mongoDBConnection);

	const datas = [
		{
			name: "The Pope's Exorcist",
			slug: "the_pope_exorcist",
			description:
				"Bộ phim lấy cảm hứng từ các tệp tin thực tế của Cha Gabriele Amorth, người được bổ nhiệm làm Giám đốc trừ tà chính của Vatican (diễn viên đoạt giải Oscar® Russell Crowe). Phim kể về cuộc điều tra của Amorth vào một trường hợp chiếm đoạt linh hồn đáng sợ của một cậu bé. Trong quá trình điều tra, ông phát hiện ra một âm mưu cổ xưa mà Vatican đã cố gắng giấu kín trong hàng thế kỷ.",
			trailer: "the_pope_exorcist/trailer/1.mp4",
			cover: "the_pope_exorcist/cover/1.jpeg",
			nb_episodes: 1,
			kind: [
				{
					name: "Kinh dị",
					slug: "kinh di",
				},
			],
			type: typeMovie.MOVIE,
			url_episode: "the_pope_exorcist/video",
			trailer_storage: typeS3.MINIO,
			cover_storage: typeS3.MINIO,
		},
		{
			name: "House of Gucci",
			slug: "house_of_gucci",
			description:
				"Khi Patrizia Reggiani, một người ngoài cuộc với khởi đầu khiêm tốn, kết hôn với gia đình Gucci, tham vọng không thể kiềm chế của cô bắt đầu làm sáng tỏ di sản của gia đình và gây ra một vòng xoáy liều lĩnh gồm phản bội, suy đồi, trả thù - và cuối cùng là giết người",
			trailer: "house_of_gucci/trailer/1.mp4",
			cover: "house_of_gucci/cover/1.jpeg",
			nb_episodes: 1,
			kind: [
				{
					name: "Hình sự",
					slug: "hinh_su",
				},
				{
					name: "Giật gân",
					slug: "giat_gan",
				},
			],
			type: typeMovie.MOVIE,
			url_episode: "house_of_gucci/video",
			trailer_storage: typeS3.MINIO,
			cover_storage: typeS3.MINIO,
		},
		{
			name: "The God Father",
			slug: "the_god_father",
			description:
				"THE GODFATHER khá đơn giản là một tác phẩm làm phim tuyệt vời, một sử thi theo nghĩa chân thực nhất của từ này và cho đến nay là bộ phim xã hội đen hay nhất từng được quay. Được tạo ra với sự khéo léo, phong cách phù hợp và một đạo diễn khơi gợi những màn trình diễn hoàn hảo từ một dàn diễn viên tài năng, đây là cách làm phim đúng như vậy. Bố già 'Don' Vito Corleone là người đứng đầu gia đình mafia Corleone ở New York. Anh ấy có mặt tại sự kiện đám cưới của con gái mình. Michael, con trai út của Vito và một lính thủy đánh bộ được trang trí trong Thế chiến II cũng có mặt trong đám cưới. Michael dường như không quan tâm đến việc trở thành một phần của công việc kinh doanh của gia đình. Vito là một người đàn ông mạnh mẽ, và tốt với tất cả những người tôn trọng anh ta nhưng lại tàn nhẫn với những người không tôn trọng. Nhưng khi một đối thủ hùng mạnh và xảo quyệt muốn bán ma túy và cần sự ảnh hưởng của Don, Vito từ chối làm điều đó. Những gì tiếp theo là một cuộc xung đột giữa những giá trị cũ đang phai nhạt của Vito và những cách thức mới có thể khiến Michael làm điều mà anh ấy miễn cưỡng nhất và tiến hành một cuộc chiến tranh chống lại tất cả các gia đình mafia khác có thể chia rẽ gia đình Corleone",
			trailer: "the_god_father/trailer/1.mp4",
			cover: "the_god_father/cover/1.jpeg",
			nb_episodes: 1,
			kind: [
				{
					name: "Hành động",
					slug: "hanh_dong",
				},
			],
			type: typeMovie.MOVIE,
			url_episode: "the_god_father/video",
			trailer_storage: typeS3.MINIO,
			cover_storage: typeS3.MINIO,
		},
	];

	for (const data of datas) {
		const insertedMovie = await movieRepository.create(data);
		const array = [...Array(data.nb_episodes)].map((_, value) => value + 1);
		console.log(`movie ${data.name} inserted`);
		for (const index of array) {
			const newEpisode = {
				id_movie: insertedMovie,
				video: `${data.url_episode}/${index}.mp4`,
				video_storage: typeS3.MINIO,
				poster: null,
				poster_storage: typeS3.MINIO,
				subtitle_storage: typeS3.MINIO,
				episode: index,
			};
			await episodeRepository.create(newEpisode);
			console.log(`\tepisode ${index} inserted`);
		}
	}
	console.log("ok");
}

main();

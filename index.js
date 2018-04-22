const csvParser = require('csv-parse')
		, ua 				= require('express-useragent')
		, fs 				= require('fs')
		, debug			= require('debug')('radiocut');

const csvParserOptions = {
	columns: ['mon', 'year', 'radio_name', 'user_agents'],
	delimiter: ',',
	skip_empty_lines: true,
	trim: true,
	max_limit_on_data_read: 25000000
};

const parser = csvParser(csvParserOptions);

let m = 0;
let n = 0;
let prevRows = 0;

const interval = setInterval(() => {
	debug(`${n - prevRows} rows/sec / ${n}`);
	prevRows = n;
}, 1000);

const outputFile = fs.createWriteStream('./output.csv');

outputFile.write(['month', 'year', 'radio', 'mobile', 'total'].join(',') + '\n');

parser.on('data', (c) => {

	if (c.mon === 'mon') {
		m++;
		return;
	}

	const month = c.mon;
	const year = parseInt(c.year, 10);
	const radio = c.radio_name.trim();
	const uas = c.user_agents
		.replace(/^\[/, '')
		.replace(/\]$/, '')
		.replace(/^u/, '')
		.split(/, u/)
		.map(v => v.replace(/^\'/, '').replace(/\'/, ''))
		.map(v => ua.parse(v))
		.reduce((memo, val) => {
			if (val.isMobile || val.isTablet) {
				memo.mobile++;
			}
			memo.total++;
			return memo;
		}, {
			mobile: 0,
			total: 0
		});


	if (n % 100 === 0) {
		// debug(c);
		debug(uas);
	}

	outputFile.write([month, year, radio, uas.mobile, uas.total].join(',') + '\n');

	n++;

});

parser.on('error', (err) => {
	console.error(err);
});

parser.on('finish', () => {

	debug(`finished importing ${n} rows. ${m}`);

	clearInterval(interval);

	outputFile.end();
});

fs.createReadStream('./data.all.csv').pipe(parser);
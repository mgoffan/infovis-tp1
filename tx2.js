const csvParser = require('csv-parse')
		, ua 				= require('express-useragent')
		, fs 				= require('fs')
		, debug			= require('debug')('radiocut');

const csvParserOptions = {
	columns: ['mon', 'year', 'radio_name', 'mobile', 'total'],
	delimiter: ',',
	skip_empty_lines: true,
	trim: true,
	// max_limit_on_data_read: 25000000
};

const parser = csvParser(csvParserOptions);

let m = 0;
let n = 0;
let prevRows = 0;

const interval = setInterval(() => {
	debug(`${n - prevRows} rows/sec / ${n}`);
	prevRows = n;
}, 1000);



const q = {};

parser.on('data', (c) => {

	if (c.mon === 'month') {
		m++;
		return;
	}

	const month = c.mon;
	const year = parseInt(c.year, 10);
	const radio = c.radio_name.trim();
	const mobile = parseInt(c.mobile, 10);
	const total = parseInt(c.total, 10);

	const key = `${month}|${year}|${radio}`;

	if (q[key]) {
		q[key].mobile += mobile;
		q[key].total += total;
	} else {
		q[key] = {
			mobile,
			total
		};
	}

	n++;

});

parser.on('error', (err) => {
	console.error(err);
});

parser.on('finish', () => {

	debug(`finished importing ${n} rows. ${m}`);

	clearInterval(interval);

	// debug(q);

	const outputFile = fs.createWriteStream('./final_output.csv');

	outputFile.write(['month', 'year', 'radio', 'mobile', 'total', 'percentage'].join(',') + '\n');

	Object.keys(q).forEach(key => {
		const val = q[key];

		const [month, year, radio] = key.split('|');

		outputFile.write([month, year, radio, val.mobile, val.total, (val.mobile / val.total * 100).toFixed(2)].join(',') + '\n');
	});

	outputFile.end();
});

fs.createReadStream('./output.csv').pipe(parser);
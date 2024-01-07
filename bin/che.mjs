#!/usr/bin/env node

import { argv, exit } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, parse as parsePath } from 'node:path';
import { decodeGameSave, guessGameSaveAlgo } from '../src/game-save.mjs';

// Currently, you can do `npm link` in this repo's root dicectory to install cli temporarily.
//
// Usage: che guess <text_file>
// Will console.log algo.Name
// Usage: che decode <text_file>
// Will write a decoded file in the same directory with ".decoded.json" ext.
//
// TODO: Documentation?

const actions = ['guess', 'decode'];
const action = actions.find((item) => item === argv[2]);
if (action == null) {
	console.error('Invalid action (1st argument): ' + argv[2]);
	exit(1);
}
// console.log(action);

if (action === 'guess') {
	if (argv[3] == null) {
		console.error('Missing src file path: ' + argv[3]);
		exit(1);
	}
	const srcFilePath = resolve(argv[3]);
	const ctn = readFileSync(srcFilePath).toString();
	const algo = guessGameSaveAlgo(ctn);
	console.log(algo.Name);
	exit(0);
}

if (action === 'decode') {
	if (argv[3] == null) {
		console.error('Missing src file path: ' + argv[3]);
		exit(1);
	}
	// if (argv[4] == null) {
	// 	console.error('Missing dest directory: ' + argv[4]);
	// 	exit(1);
	// }
	const srcFilePath = resolve(argv[3]);
	const srcFileDir = parsePath(srcFilePath).dir;
	const srcBasename = parsePath(srcFilePath).name;
	// const destFilePath = resolve(argv[4]);
	const ctn = readFileSync(srcFilePath).toString();
	const gameSaveJson = decodeGameSave(ctn);
	// console.log(gameSaveJson);
	writeFileSync(resolve(srcFileDir, srcBasename + '.decoded.json'), gameSaveJson);
	exit(0);
}

// Else:
console.error('Unknown error');
exit(1);

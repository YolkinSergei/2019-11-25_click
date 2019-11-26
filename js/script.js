'use strict';

let tableDiv = document.querySelector('#table-div'),
	width = parseInt(prompt('Укажите количество столбцов:', 10)),
	height = parseInt(prompt('Укажите количество строк:', 10)),
	body = document.querySelector('body'),
	tableData = [],
	historyData = {
		currentVersion: 0,
		versionData: []
	};

let saveToHistory = function(newVersion) {
	historyData.currentVersion++;
	historyData.versionData[historyData.currentVersion] = newVersion.join('|');
	historyData.versionData.length = historyData.currentVersion + 1;
};

let applyHistoryVersion = function(version) {
	let versionData = historyData.versionData[version].split('|'),
		table = document.querySelector('#table-div table');
	
	for (let i = 0; i < versionData.length; i++) {
		tableData[i] = versionData[i].split(',');

		for (let j = 0; j < tableData[i].length; j++) {
			tableData[i][j] = parseInt(tableData[i][j]);

			checkCell(table.rows[i].cells[j], tableData[i][j]);
		}
	}

	historyData.currentVersion = version;
};

let onCellClick = function(cell) {
	let rowIndex = cell.parentElement.rowIndex,
		colIndex = cell.cellIndex;

	tableData[rowIndex][colIndex] = +!tableData[rowIndex][colIndex];

	checkCell(cell, tableData[rowIndex][colIndex]);

	saveToHistory(tableData);

	setButtonEnable('#btn-revert', true);
	setButtonEnable('#btn-restore', false);
};

let checkCell = function(cell, value) {
	cell.style.backgroundColor = (value === 1) ? 'black' : 'white';
};

let onRevertClick = function(button) {
	if (historyData.currentVersion > 0) {
		applyHistoryVersion(historyData.currentVersion - 1);
	}

	if (historyData.currentVersion <= 0) {
		button.disabled = true;
	}

	setButtonEnable('#btn-restore', true);
};

let onRestoreClick = function(button) {
	let currentVersion = historyData.currentVersion,
		maxVersion = historyData.versionData.length - 1;

	if (currentVersion < maxVersion) {
		applyHistoryVersion(currentVersion + 1);
	} 

	if (currentVersion === maxVersion - 1) {
		button.disabled = true;
	}

	setButtonEnable('#btn-revert', true);
};

let onClearClick = function(button) {
	let table = document.querySelector('#table-div table');

	for (let i = 0; i < tableData.length; i++) {
		for (let j = 0; j < tableData[i].length; j++) {
			tableData[i][j] = 0;

			checkCell(table.rows[i].cells[j], tableData[i][j]);
		}
	}

	saveToHistory(tableData);
}

let setButtonEnable = function(query, value) {
	let btn = document.querySelector(query);
	btn.disabled = !value;
};

let createButton = function(config) {
	let button = document.createElement('button'),
		icon = document.createElement('span');

	button.setAttribute('class', 'btn btn-' + config.style);
	button.setAttribute('id', config.id);
	button.innerText = ' ' + config.text;
	icon.setAttribute('class', 'glyphicon glyphicon-' + config.icon);
	button.prepend(icon);
	button.disabled = config.disabled === undefined ? false : config.disabled;

	return button;
};

body.addEventListener('click', function(event) {
	if (event.target.tagName === 'TD') {
		onCellClick(event.target);
	}
	if (event.target.tagName === 'BUTTON') {
		switch (event.target.id) {
			case 'btn-revert': {
				onRevertClick(event.target); 
				break;
			}
			case 'btn-restore': {
				onRestoreClick(event.target);
				break;
			}
			case 'btn-clear': {
				onClearClick(event.target);
				break;
			}
		}
	}
});

let createTable = function(element, width, height) {
	let table = document.createElement('table');

	for (let i = 0; i < height; i++) {
		let row = document.createElement('tr');

		tableData[i] = [];

		for (let j = 0; j < width; j++) {
			let cell = document.createElement('td');

			cell.setAttribute('id', 'cell' + i + j);

			row.appendChild(cell);

			tableData[i][j] = 0;
		}

		table.appendChild(row);
	}

	historyData.versionData.push(tableData.join('|'));

	element.appendChild(table);

	element.appendChild( createButton({
		style: 'info',
		icon: 'menu-left',
		id: 'btn-revert',
		text: 'Revert',
		disabled: true
	}) );

	element.appendChild( createButton({
		style: 'danger',
		icon: 'trash',
		id: 'btn-clear',
		text: 'Clear',
		disabled: false
	}) );

	element.appendChild( createButton({
		style: 'info',
		icon: 'menu-right',
		id: 'btn-restore',
		text: 'Restore',
		disabled: true
	}) );
}

createTable(tableDiv, width, height);
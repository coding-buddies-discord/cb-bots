const findFlag = (str) => {
	const myExp = /--\w+/;
	const found = str.match(myExp);
	return found?.[0]
}

const findValue = (command, str) => {
	const myExp = new RegExp(`${command}=['"]\\s*(.+?)\\s*?['"]`); 
	const found = str.match(myExp);
	return found?.[1]
}

export { findFlag, findValue }
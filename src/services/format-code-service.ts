import beautify from "js-beautify";

import { config } from "../config/bot-config";
import { cssFormatConfig, htmlFormatConfig, jsFormatConfig } from "../config/code-format-config";

type SupportedLanguage = typeof config["languagesFormats"][number];

interface Beautifier<T> {
	beautifier: (code: string, format: T) => string;
	config: T;
}

const beautifiers: Record<SupportedLanguage, Beautifier<any>> = {
	"!js": {
		beautifier: beautify.js,
		config: jsFormatConfig,
	},
	"!css": {
		beautifier: beautify.css,
		config: cssFormatConfig,
	},
	"!html": {
		beautifier: beautify.html,
		config: htmlFormatConfig,
	},
};

const isSupportedLanguage = (lang: string): lang is SupportedLanguage => lang in beautifiers;

export const formatCode = async (code: string, language: string) => {
	if(!isSupportedLanguage(language)) Promise.reject("Language not supported");

	return Promise
		.resolve(code)
		.then(code => code.replace(/!\w+/, ""))
		.then(code => {
			const { beautifier, config } = beautifiers[language as SupportedLanguage];
			return beautifier(code, config);
		})
		.then(responseMessage => `\`\`\`js\n${responseMessage}\`\`\``);
};

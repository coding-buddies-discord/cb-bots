const commonFormatConfig = {

} as const;

export const jsFormatConfig = {
	...commonFormatConfig,
	"space-in-paren": false,
	brace_style: "none",
	break_chained_methods: false,
	comma_first: false,
	e4x: false,
	editorconfig: false,
	end_with_newline: false,
	eol: "\n",
	indent_char: " ",
	indent_empty_lines: false,
	indent_level: 0,
	indent_size: 5,
	indent_with_tabs: false,
	jslint_happy: true,
	keep_array_indentation: false,
	max_preserve_newlines: 25,
	operator_position: "preserve-newline",
	preserve_newlines: true,
	space_after_anon_function: false,
	space_after_named_function: false,
	space_in_empty_paren: false,
	space_in_paren: false,
	templating: ["auto"] as string[],
	unescape_strings: false,
	unindent_chained_methods: false,
	wrap_line_length: 0,
} as const;

export const cssFormatConfig = {
	...commonFormatConfig,
} as const;

export const htmlFormatConfig = {
	...commonFormatConfig,
} as const;

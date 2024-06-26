import config from "eslint-config-mourner";

export default [
	...config,
	{
		rules: {
			'no-sequences': 0,
			'no-useless-assignment': 0
		}
	}
];

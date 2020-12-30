import configProduction from './config.production';
import configDevelopment from './config.development';

const config = {
	...(process.env.NODE_ENV === 'production' ? configProduction : configDevelopment)
};

export default config;
#!/usr/local/bin/node
'use strict';
/**
* @file youtube-video-info.js
* @brief Get basic, permanent info for the given URL of a YouTube video.
* @author Anadian
* @copyright MITlicensetm(2019,Canosw)
*/

//Dependencies
	//Internal
	//Standard
	const FileSystem = require('fs');
	const Utility = require('util');
	//External
	const RequestPromiseNative = require('request-promise-native');

//Constants
const FILENAME = 'youtube-video-info.js';
const MODULE_NAME = 'YouTubeVideoInfo';
var PROCESS_NAME = '';
if(require.main === module){
	PROCESS_NAME = 'youtube-video-info';
} else{
	PROCESS_NAME = process.argv0;
}

//Global Variables
var Logger = null;
//Functions
function Logger_Set( logger ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Logger_Set';
	//Variables
	var function_return = [1,null];

	//Parametre checks
	if( logger == undefined || typeof(logger) !== 'object' ){
		_return = [-2,'Error: param "logger" is either null or not an object.'];
	}

	//Function
	if( _return[0] === 1 ){
		Logger = logger;
		_return = [0,null];
	}

	//Return
	return _return;
}

/**
* @fn Request_Async
* @brief Asynchronous use of request module.
* @async true
* @param url
*	@type String
*	@brief The URL to be http-get'd.
*	@default null
* @return <ARRAY>
*	@entry 0 
*		@retval 1 premature return.
*		@retval 0 on success.
*		@retval <0 on failure.
*	@entry 1
*		@retval <object> on success
*		@retval <error_message> on failure.
*/
async function Request_Async( url ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Request_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var function_return = null;

	//Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','received: '+arguments.toString());
	//Parametre checks
	if(url == undefined) url = null;
	
	//Function
	if( url !== null ){
		try{
			function_return = await RequestPromiseNative(url);
			_return = [0, function_return];
		} catch(error){
			function_return = error;
			_return = [-3, function_return];
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	//Log.log(PROCESS_NAME,MODULE_NAME,FILENAME,FUNCTION_NAME,'debug','returned: '+_return.toString());
	return _return;
}

async function URL_To_File( url, filepath ){
	var _return = [1,null];
	const FUNCTION_NAME = 'URL_To_File';
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( url == null || typeof(url) !== 'string' ){
		_return = [-2, 'Error: parametre "url" is either null or not a string.'];
	}
	if( filepath == null || typeof(filepath) !== 'string' ){
		_return = [-3, 'Error: parametre "filepath" is either null or not a string.'];
	}
	if( _return[0] === 1 ){
		try{
			function_return = await Request_Async(url);
		} catch(error){
			function_return = [-4,'Request_Async threw: '+error];
		}
		if( function_return[0] === 0 ){
			try{
				FileSystem.writeFileSync(filepath, function_return[1], 'utf8');
				_return = [0,null];
			} catch(error){
				_return = [-8, 'FileSystem.writeFileSync threw: '+error];
			}
		} else{
			_return = function_return;
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

async function URLArray_To_Files( url_array ){
	var _return = [1,null];
	const FUNCTION_NAME = 'URLArray_To_Files';
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( url_array == null || Array.isArray(url_array) !== true ){
		_return = [-2, 'Error: parametre "url_array" is either null or not an array.'];
	}
	if( _return[0] === 1 ){
		for(var i = 0; i < url_array.length; i++){
			function_return = URL_To_File( url_array[i], 'request_'+i+'.html');
			if( function_return[0] !== 0 ){
				console.error('%d: URL_To_File: %s', i, function_return[1]);
			}
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

function ObjectFromRegexSpecAndData( regex_spec, data ){
	var _return = [1,null];
	const FUNCTION_NAME = 'ObjectFromRegexSpecAndData';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var output_object = {};
	var regex_spec_keys = null;
	var match_result = null;
	var regex = null;
	//Parametre checks
	if( regex_spec == null || typeof(regex_spec) !== 'object' ){
		 _return = [-2, 'Error: param "regex_spec" is either null or not an object.'];
	}
	if( data == null || typeof(data) !== 'string' ){
		_return = [-3, 'Error: param "data" is either null or not a string.'];
	}
	//Function
	if( _return[0] === 1 ){
		regex_spec_keys = Object.keys(regex_spec);
		for( var i = 0; i < regex_spec_keys.length; i++ ){
			regex = new RegExp(regex_spec[regex_spec_keys[i]]);
			match_result = data.match(regex);
			//Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('match_result: %o', match_result)});
			if( match_result != null ){
				output_object[regex_spec_keys[i]] = match_result[1];
			}
		}
		_return = [0,output_object];
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

function InfoMarkdownFromObject( object ){
	var _return = [1,null];
	const FUNCTION_NAME = 'InfoMarkdownFromObject';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	//Parametre checks
	if( object == null || typeof(object) !== 'object' ){
		_return = [-2, 'Error: param "object" is either null or not an object.'];
	}
	//Function
	if( _return[0] === 1 ){
		_return = [0,`Video: [${object.title}](${object.url}) (${object.date}, ${object.duration})\n\tDescription: ${object.description}\n\tTags: ${object.tags}`];
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

function YouTubeVideoInfoObjectFromRegexSpecReturnObject( regex_spec_return_object ){
	var _return = [1,null];
	const FUNCTION_NAME = 'YouTubeVideInfoObjectFromRegexSpecReturnObject';


	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var output_object = {};
	var temp_string = '';
	//Parametres checks
	if( regex_spec_return_object == null || typeof(regex_spec_return_object) !== 'object' ){
		_return = [-2, 'Error: param "regex_spec_return_object" is either null or not an object.'];
	}
	//Function
	if( _return[0] === 1 ){
		output_object.url = regex_spec_return_object.url;
		output_object.title = regex_spec_return_object.title;
		temp_string = regex_spec_return_object.description.replace(/\\\\/g,'\\');
		output_object.description = temp_string.replace(/\\\u002F/g,'/');
		output_object.rating = regex_spec_return_object.rating;
		output_object.views = regex_spec_return_object.views;
		output_object.author = regex_spec_return_object.author;
		output_object.tags = regex_spec_return_object.tags.replace(/\\/g,'');
		output_object.date = regex_spec_return_object.date;
		output_object.duration = regex_spec_return_object.duration;
		_return = [0, output_object];
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

function YouTubeVideoInfoMarkdown_From_WebPageData_Async( web_page_data ){
	var _return = [1,null];
	const FUNCTION_NAME = 'YouTubeVideoInfoObject_From_WebPageData_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( web_page_data == null || typeof(web_page_data) !== 'string' ){
		_return = [-2, 'Error: param "web_page_data" is either null or not a string.'];
	}
	if( _return[0] === 1 ){
		const permanent_youtube_video_info_regexspec = {
			url: '<meta property="og:url" content="(.+)">',
			title: '<meta property="og:title" content="(.+)">',
			description: ',\\\\"shortDescription\\\\":\\\\"(.*)\\\\",\\\\"isCrawlable',
			rating: ',\\\\"averageRating\\\\":([0-9.]+),\\\\"allowRatings',
			views: ',\\\\"viewCount\\\\":\\\\"(\\d+)\\\\",',
			author: ',\\\\"author\\\\":\\\\"(\\w+)\\\\",\\\\"isPrivate',
			tags: ',\\\\"keywords\\\\":\\[([^\\]]*)\\],\\\\"channelId',
			date: '<meta itemprop="datePublished" content="([0-9-]+)">',
			duration: ',\\\\"lengthSeconds\\\\":\\\\"(\\d+)\\\\",'
		};
		function_return = ObjectFromRegexSpecAndData( permanent_youtube_video_info_regexspec, web_page_data );
		if( function_return[0] === 0 ){
			function_return = YouTubeVideoInfoObjectFromRegexSpecReturnObject(function_return[1]);
			if( function_return[0] === 0 ){
				function_return = InfoMarkdownFromObject(function_return[1]);
				if( function_return[0] === 0 ){
					_return = [0, function_return[1]];
				} else{
					_return = [function_return[0], 'InfoMarkdownFromObject: '+function_return[1]];
				}
			} else{
				_return = [function_return[0], 'ObjectFromRegexSpecAndData: '+function_return[1]];
			}
		} else{
			_return = [function_return[0], 'YouTubeVideoInfoObjectFromRegexSpecReturnObject: '+function_return[1]];
		}
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}

async function Main_YouTubeVideoInfoMarkdown_STDOUT_From_URL_Async( url ){
	var _return = [1,null];
	const FUNCTION_NAME = 'Main_YouTubeVideoInfoMarkdown_STDOUT_From_URL_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('received: %o', arguments)});
	//Variables
	var function_return = [1,null];
	//Parametre checks
	if( url == null || typeof(url) !== 'string' ){
		_return = [-2, 'Error: param "url" is either null or not a string.'];
	}
	//Function
	if( _return[0] === 1 ){
		function_return = await Request_Async(url);
		if( function_return[0] === 0 ){
			function_return = await YouTubeVideoInfoMarkdown_From_WebPageData_Async( function_return[1] );
			if( function_return[0] === 0 ){
				_return = [0,function_return[1]];
			} else{
				_return = [function_return[0], 'YouTubeVideoInfoMarkdown_From_WebPageData_Async: '+function_return[1]];
			}
		} else{
			_return = [function_return[0], 'Request_Async: '+function_return[1]];
		}
	}
	if( _return[0] === 0 ){
		console.log(_return[1]);
		process.exitCode = 0;
	} else{
		console.error(_return);
		process.exitCode = _return[0];
	}
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: Utility.format('returned: %o', _return)});
	return _return;
}
//Exports and Execution
if(require.main === module){
	var _return = [1,null];
	const FUNCTION_NAME = 'MainExecutionFunction';
	//Dependencies
		//Internal
		const ApplicationLogStandard = require('./application-log-standard.js');
		//Standard
		//External
		const Winston = require('winston');
		const LogForm = require('logform');
	//Constants
	Logger_Set( Winston.createLogger({
		level: 'debug',
		levels: ApplicationLogStandard.levels,
		transports: [
		new Winston.transports.Console({
			level: 'debug',
				format: LogForm.format.combine(
					LogForm.format.colorize({
						all: true,
						colors: ApplicationLogStandard.colors
					}),
					LogForm.format.splat(),
					LogForm.format.printf((info) => {
						return `${info.level}: ${info.function?info.function+':':''} ${info.message}`;
					})
				),
				stderrLevels: ['emerg','alert','crit','error','warn','note','info','debug'],
				warnLevels: ['warn','note']
			}),
		new Winston.transports.File({
			level: 'debug',
			format: LogForm.format.combine(
				LogForm.format.timestamp(),
				LogForm.format.splat(),
				LogForm.format.printf((info) => {
					return `${info.timestamp} ${info.process?info.process+':':''}${info.module?info.module+':':''}${info.file?info.file+':':""}${info.function?info.function+':':''}${info.level}: ${info.message}${(info.meta)?' '+info.meta:''}`;
					})
			),
			eol: '\n',
			filename: 'log_debug.log',
			maxsize: 1048576,
			maxFiles: 4
		})
	]
	}) );
	//Variables
	var function_return = [1,null];
	//Logger
	//Options
	if( process.argv.length > 2 ){
		var url_array = process.argv.slice(2);
		URLArray_To_Files( url_array );
		Main_YouTubeVideoInfoMarkdown_STDOUT_From_URL_Async( process.argv[2] );
	}
	//Config
	//Main
} else{
	
}


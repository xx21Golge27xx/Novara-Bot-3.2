const Discord = require("discord.js");
const { EmbedBuilder,MessageEmbed } = require("discord.js")
const fs = require("fs");
const config = require("./config.json");
const prefixConfig = require("./config/prefixConfig");
const functions = require('./function/functions');
const Rest = require("@discordjs/rest");
const DiscordApi = require("discord-api-types/v10");
// MongoDB connection
const connectDB = require('./database/mongodb');
connectDB();

const client = new Discord.Client({
	intents:  3276543,
    partials: Object.values(Discord.Partials),
	allowedMentions: {
		parse: ["users", "roles", "everyone"]
	},
	retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

// Load slash commands
console.log(`[-] ${fs.readdirSync("./commands_slash").length} slash komutu algılandı.`)

for(let commandName of fs.readdirSync("./commands_slash")) {
	if(!commandName.endsWith(".js")) continue;

	const command = require(`./commands_slash/${commandName}`);
	console.log(`Loading slash command: ${command.name}`);
	client.commands.push({
		name: command.name.toLowerCase(),
		description: command.description.toLowerCase(),
		options: command.options,
		dm_permission: false,
		type: 1
	});

	console.log(`[+] ${commandName} slash komutu başarıyla yüklendi.`)
}

// Load prefix commands
client.prefixCommands = [];
console.log(`[-] ${fs.readdirSync("./commands_prefix").length} prefix komutu algılandı.`)

for(let commandName of fs.readdirSync("./commands_prefix")) {
	if(!commandName.endsWith(".js")) continue;

	const command = require(`./commands_prefix/${commandName}`);	
	client.prefixCommands.push({
		name: command.name.toLowerCase(),
		description: command.description,
		run: command.run
	});

	console.log(`[+] ${commandName} prefix komutu başarıyla yüklendi.`)
}

// Track command cooldowns
client.cooldowns = new Map();

client.on('messageCreate', msg => { 
	// Handle bot mention
	if (msg.content === `<@${config["bot-id"]}>`) {
        msg.reply('Birisi Beni Çağırdı Sanırım Komutlarıma `/yardım` ile bakabilirsin  💕');
    }
	
	// Handle prefix commands
	if (msg.author.bot) return;
	if (!msg.content.startsWith(prefixConfig.prefix)) return;
	
	const args = msg.content.slice(prefixConfig.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	// Check for aliases
	let command = client.prefixCommands.find(cmd => cmd.name === commandName);
	if (!command) {
		// Check aliases
		for (const [cmdName, aliases] of Object.entries(prefixConfig.aliases)) {
			if (aliases.includes(commandName)) {
				command = client.prefixCommands.find(cmd => cmd.name === cmdName);
				break;
			}
		}
	}
	
	// If command not found, check if there's a slash command with the same name
	if (!command) {
		const slashCommand = client.commands.find(cmd => cmd.name === commandName);
		if (slashCommand) {
			// Create a mock interaction object
			const mockInteraction = {
				user: msg.author,
				member: msg.member,
				guild: msg.guild,
				channel: msg.channel,
				options: {
					getUser: (name) => {
						const userMention = args.find(arg => arg.startsWith('<@') && arg.endsWith('>'));
						if (userMention) {
							const userId = userMention.slice(2, -1).replace('!', '');
							return msg.guild.members.cache.get(userId)?.user || null;
						}
						return null;
					},
					getMember: (name) => {
						const userMention = args.find(arg => arg.startsWith('<@') && arg.endsWith('>'));
						if (userMention) {
							const userId = userMention.slice(2, -1).replace('!', '');
							return msg.guild.members.cache.get(userId) || null;
						}
						return null;
					},
					getString: (name) => {
						return args.join(' ') || null;
					},
					getInteger: (name) => {
						const num = parseInt(args[0]);
						return isNaN(num) ? null : num;
					}
				},
				reply: msg.reply.bind(msg),
				deferReply: () => Promise.resolve(),
				editReply: msg.reply.bind(msg),
				followUp: msg.reply.bind(msg)
			};
			
			// Try to execute the slash command with the mock interaction
			try {
				const slashCommandModule = require(`./commands_slash/${commandName}.js`);
				slashCommandModule.run(client, mockInteraction);
			} catch (error) {
				console.error(`Error executing slash command as prefix: ${error}`);
				msg.reply('Komut çalıştırılırken bir hata oluştu!');
			}
			return;
		}
	}
	
	// If we found a prefix command, execute it
	if (command) {
		// Check if command is disabled
		if (prefixConfig.disabledCommands.includes(command.name)) {
			return msg.reply('Bu komut şu anda devre dışı.');
		}
		
		// Check cooldown
		if (prefixConfig.cooldowns[command.name]) {
			const cooldownAmount = prefixConfig.cooldowns[command.name];
			if (client.cooldowns.has(command.name)) {
				const expirationTime = client.cooldowns.get(command.name) + cooldownAmount;
				if (Date.now() < expirationTime) {
					const timeLeft = (expirationTime - Date.now()) / 1000;
					return msg.reply(`Bu komutu tekrar kullanabilmek için ${timeLeft.toFixed(1)} saniye beklemelisin.`);
				}
			}
			client.cooldowns.set(command.name, Date.now());
			setTimeout(() => client.cooldowns.delete(command.name), cooldownAmount);
		}
		
		try {
			command.run(client, msg, args);
		} catch (error) {
			console.error(error);
			msg.reply('Komut çalıştırılırken bir hata oluştu!');
		}
	}
});

// Auto replies
client.on('messageCreate', msg => {
    const content = msg.content.toLowerCase(); 

    const replies = {
        'sa': 'aleykümselam',
        'naber': 'iyi senden naber',
        'sea': 'aleykümselam',
        'selam': 'aleykümselam',
        'selamun aleyküm': 'aleykümselam',
        'selamunaleyküm': 'aleykümselam',
        'selamunaleykum': 'aleykümselam'
    };
	if (replies[content]) {
		msg.reply(replies[content]);
	}
});

// Load events
console.log(`[-] ${fs.readdirSync("./events").length} olay algılandı.`)

for(let eventName of fs.readdirSync("./events")) {
	if(!eventName.endsWith(".js")) continue;

	const event = require(`./events/${eventName}`);	
	const evenet_name = eventName.split(".")[0];

	client.on(event.name, (...args) => {
		event.run(client, ...args)
	});

	console.log(`[+] ${eventName} olayı başarıyla yüklendi.`)
}

client.once("ready", async() => {
	const rest = new Rest.REST({ version: "10" }).setToken(config.token);
  try {
    console.log(`Registering ${client.commands.length} slash commands`);
    await rest.put(DiscordApi.Routes.applicationCommands(client.user.id), {
      body: client.commands,  //
    });
	
	console.log(`${client.user.tag} Aktif! 💕`);

  } catch (error) {
    console.error('Error registering slash commands:', error);
    throw error;
  }
});

client.login(config.token).then(() => {
	console.log(`[-] Discord API'ye istek gönderiliyor.`);
	eval("console.clear()")
}).catch(() => {
	console.log(`[x] Discord API'ye istek gönderimi başarısız(token girmeyi unutmuşsun).`);
}); 

const process = require('node:process');

process.on('unhandledRejection', async (reason, promise) => {
    console.log('Unhandled Rejection at: ', promise, 'reason: ', reason);
});
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception: ', err);
});
process.on('uncaughtExceptionMonitor', async (err, origin) => {
    console.log('Uncaught Exception Monitor: ', err, 'origin: ', origin);
});

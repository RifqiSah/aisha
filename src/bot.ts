import "./lib/env";
import { Client } from 'discord.js';

const client = new Client();

const prefix = '%';
const token = process.env.TOKEN;

client.on('ready', () => {
  client.user?.setActivity('Typescript BOT');
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong from Typescript!');
  }
});

client.login(token);

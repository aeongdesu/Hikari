const config = require('./config.json')

const { ShardingManager } = require('discord.js-light');
const shard = new ShardingManager('./index.js', {
  token: config.TOKEN,
  autoSpawn: true
});

shard.on('shardCreate', shard => console.log(`히카리 ${shard.id + 1}명`));
shard.spawn();
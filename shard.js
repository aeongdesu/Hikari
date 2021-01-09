const config = require('./config.json')

const { ShardingManager } = require('discord.js-light');
const shard = new ShardingManager('./index.js', {
  token: config.TOKEN,
  autoSpawn: true
});

shard.spawn(2);

shard.on('shardCreate', shard => console.log(`[Hikari Shard]] ${shard.id} / ${shard.totalShards}`));
const channels = require('express').Router();

channels.use('/zoom', require('./zoom'));

const iconPrefix = '/static/channel-icons';
const configPatePathPrefix = '/captioner/settings/channels/new?type=';

const channelsList = [
  {
    id: 'dropbox',
    name: 'Dropbox',
    iconPath: `${iconPrefix}/dropbox.png`,
    limit: 1,
    configPagePath: `${configPatePathPrefix}dropbox`,
  },
  {
    id: 'vmix',
    name: 'vMix',
    iconPath: `${iconPrefix}/vmix.png`,
    limit: 1,
    configPagePath: `${configPatePathPrefix}vmix`,
  },
  {
    id: 'link',
    name: 'Link or Embed',
    iconName: 'link',
    limit: 1,
    configPagePath: `${configPatePathPrefix}link`,
  },
  {
    id: 'webhook',
    name: 'Webhook',
    iconName: 'plug',
    limit: 1,
    configPagePath: `${configPatePathPrefix}webhook`,
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    iconPath: `${iconPrefix}/obs.svg`,
    showNameWithIcon: true,
    limit: 1,
    configPagePath: `${configPatePathPrefix}obs`,
  },
  {
    id: 'zoom',
    name: 'Zoom',
    iconPath: `${iconPrefix}/zoom.png`,
    limit: 1,
    configPagePath: `${configPatePathPrefix}zoom`,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    iconPath: `${iconPrefix}/youtube.png`,
    limit: 1,
    configPagePath: `${configPatePathPrefix}youtube`,
  },
];

channels.get('/', async (req, res, next) => {
  // Sort alphabetically by name
  res.send(channelsList.sort((a, b) => a.name.localeCompare(b.name)));
});

channels.get('/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(404);
  }

  const foundChannel = channelsList.find((channel) => channel.id === id);

  if (foundChannel) {
    res.send(foundChannel);
  } else {
    return res.sendStatus(404);
  }
});

module.exports = channels;

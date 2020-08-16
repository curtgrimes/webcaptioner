const channels = require('express').Router();

channels.use('/zoom', require('./zoom'));
channels.use('/youtube', require('./youtube'));

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
  // {
  //   id: 'link',
  //   name: 'Link or Embed',
  //   iconName: 'link',
  //   limit: 1,
  //   configPagePath: `${configPatePathPrefix}link`,
  // },
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
    requiredExperiment: 'youtube',
  },
];

channels.get('/', async (req, res, next) => {
  let { experiments } = req.query;
  experiments = experiments ? String(experiments).split(',') : [];

  let channelsToReturn = [
    ...channelsList.sort((a, b) =>
      // Sort alphabetically by name
      a.name.localeCompare(b.name)
    ),
  ].map((c) => ({ ...c })); // clone

  // Filter out any channels that require experiments
  // to be enabled, unless those experiments are enabled
  channelsToReturn = channelsToReturn.filter(
    (channel) =>
      !channel.requiredExperiment ||
      experiments.includes(channel.requiredExperiment)
  );

  channelsToReturn.forEach((channel) => delete channel.requiredExperiment);

  res.send(channelsToReturn);
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

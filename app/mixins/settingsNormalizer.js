import { v4 as uuidv4 } from 'uuid';

export function normalizeSettings({ localStorageData }) {
  if (localStorageData?.settings?.integrations?.webhooks) {
    // Old webhook data. Convert to channel.
    if (!localStorageData.settings.channels) {
      localStorageData.settings.channels = [];
    }

    localStorageData.settings.channels.push({
      id: uuidv4(),
      type: 'webhook',
      on: localStorageData.settings.integrations.webhooks.on,
      parameters: {
        url: localStorageData.settings.integrations.webhooks.url,
        method:
          localStorageData.settings.integrations.webhooks.method === 'POST'
            ? 'post'
            : 'put',
      },
    });

    delete localStorageData.settings.integrations.webhooks;
  }

  if (localStorageData?.settings?.integrations?.dropbox?.accessToken) {
    // Old Dropbox integration. Convert to channel.
    if (!localStorageData.settings.channels) {
      localStorageData.settings.channels = [];
    }

    localStorageData.settings.channels.push({
      id: uuidv4(),
      type: 'dropbox',
      on: true,
      parameters: {
        accessToken: localStorageData.settings.integrations.dropbox.accessToken,
        accountId: localStorageData.settings.integrations.dropbox.accountId,
      },
    });

    delete localStorageData.settings.integrations.dropbox;
  }

  return localStorageData?.settings;
}

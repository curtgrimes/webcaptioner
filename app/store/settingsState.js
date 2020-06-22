export default () => {
  return {
    share: {
      on: false,
      roomId: null,
      ownerKey: null,
      url: null,
      expires: true,
      expireDate: null,
      urlType: 'random', // or 'vanity'
      vanity: '',
    },
    roomMembershipId: null,
    roomLeaderToken: null,
    controls: {
      layout: {
        larger: false,
      },
      volumeMeter: {
        show: true,
        sensitivity: 'high',
      },
    },
    appearance: {
      text: {
        textColor: '#ffffff',
        textColorInterim: '#ffffff',
        fontFamily: 'Cousine',
        fontVariant: 'regular',
        textSize: '4', // em
        lineHeight: '1.2', // em
        letterSpacing: '0', // em
        textTransform: 'uppercase', // or "capitalize" or "initial"
        alignment: {
          horizontal: 'full', // left, middle, right
          vertical: 'full', // top, middle, bottom, lowerThird
          padding: '0.25', // em
        },
      },
      shadow: {
        color: '#000000',
        opacity: '100',
        blurRadius: '0',
        offsetX: '0.05',
        offsetY: '0.05',
      },
      background: {
        color: '#000000',
        opacity: '100',
      },
    },
    chromelessWindow: {
      left: null,
      top: null,
      width: null,
      height: null,
    },
    wordReplacements: [],
    censor: {
      on: false,
      replaceWith: 'nothing', // or 'asterisks'
    },
    locale: {
      from: null,
      userDefault: null,
    },
    integrations: {
      dropbox: {
        accessToken: null,
        accountId: null,
      },
      vmix: {
        on: false,
        webControllerAddress: '',
      },
      webhooks: {
        on: false,
        url: '',
        method: 'POST',
        throttleMs: 200,
      },
      zoom: {
        on: false,
        url: '',
        lastSequenceNumber: 0,
      },
    },
    channels: [],
    afterNoAudio: {
      seconds: 2,
      action: 'lineBreak2',
    },
    alwaysAutostartOnLoad: false,
    donationDate: null,
    exp: [],
  };
};

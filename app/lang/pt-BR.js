export default {
  common: {
    ok: 'Ok',
    cancel: 'Cancelar',
    clear: 'Limpar',
    search: 'Procurar...',
    close: 'Fechar',
    add: 'Adicionar',
    remove: 'Remover',
    off: 'Desligar',
    on: 'Ligar',
    update: 'Atualizar',
    setup: 'Configuração',
    setUpVerb: 'Configurar',
    showSetup: 'Visualizar configuração',
    hideSetup: 'Ocultar configuração',
    loading: 'Carregando',
    install: 'Instalar',
    next: 'Próximo',
    done: 'Pronto',
    dismiss: 'Dispensar',
  },
  app: {
    webCaptioner: 'Web Captioner',
    description:
      'Legendas em tempo real para o seu evento, discurso, palestra em sala-de-aula ou culto na igreja.',
  },
  captioner: {
    volumeMeter: {
      tooLoud: 'Muito alto',
      tooQuiet: 'Muito baixo',
    },
    clearTranscript: {
      title: 'Limpar transcrição? ',
      ok: 'Limpar transcrição',
    },
    saveToFile: {
      title: 'Salvar arquivo',
      description: 'Salve sua transcrição atual em um arquivo.',
      transcriptEmptyMessage:
        'Psiu... Sabe que você ainda não tem nada para salvar, né?',
      textFile: 'Arquivo de texto',
      text: 'Texto',
      wordDocument: 'Documento do Word',
      word: 'Word',
    },
  },
  receiver: {
    splash: {
      captionsWillBeginShortly: 'As legendas começarão em breve.',
      connected: 'Conectado!',
      useThisCodeToConnect: 'Usar este código para se conectar.',
    },
  },
  googleCast: {
    cast: 'Transmitir',
    connecting: 'Conectando',
    castingToReceiver: 'Transmitindo ao {receiverName}',
    castingFailed: 'Transmissão Falhou',
    unableToCast: 'Incapaz de transmitir',
    pleaseTryAgain: 'Por favor, tente novamente.',
  },
  navbar: {
    captioner: {
      startCaptioning: 'Começar a legendar',
      stopCaptioning: 'Parar de legendar',
      listeningToMicrophone: 'Escutando ao "{microphoneName}"',
      listening: 'Escutando',
    },
    menu: {
      about: '@:settings.about.about',
      blog: 'Blog',
      helpCenter: 'Centro de ajuda',
      community: 'Comunidade',
      donate: 'Doar',
      feedback: 'Opiniões',
      newWindow: 'Nova janela',
      newWindowDescription: '@:settings.controls.showNewWindow',
      saveToFile: '@:captioner.saveToFile.title',
      settings: 'Ajustes',
    },
    vmixNotConnected: 'vMix não está conectado',
  },
  settings: {
    settings: 'Ajustes',
    general: 'Geral',
    integrations: 'Integrações',
    other: 'Outros',
    about: {
      about: 'Sobre',
      learnMore: 'Saber mais',
      whatsNew: 'Novidades',
      whatsNewInWebCaptioner: 'Novidades com @:app.webCaptioner',
      getStarted: 'Iniciar',
    },
    experiments: {
      experiments: 'Experimentos',
      description:
        'Não se esqueça de ajudar e me dar opiniões sobre experimentos! Envie-me um e-mail para {email} ou {messageMeOnFacebook}.',
      messageMeOnFacebook: 'me mande mensagem no Facebook',
      addExperimentConfirmation:
        'Deseja adicionar o experimento "{experimentName}"?',
      addExperiment: 'Adicionar experimento',
      experimentName: 'Nome do experimento',
      alreadyAdded:
        'Você já adicionou o experimento "{alreadyAddedExperimentName}".',
      addedExperiments: 'Experimentos adicionados',
    },
    appearance: {
      appearance: 'Aparência',
      preview: 'Pré-visualização',
      text: 'Texto',
      textColor: 'Cor do texto',
      textColorInterim: 'Cor temporária de texto',
      useRegularTextColor: 'Usar a cor de texto padrão',
      interimTextColorDescription:
        'Durante as legendas, as palavras que acabaram de ser reconhecidas podem mudar um pouco, enquanto o Web Captioner determina o contexto da frase. Essas palavras serão mostradas nesta cor.',
      fontFamily: 'Família de fontes',
      textSize: 'Tamanho do texto',
      lineHeight: 'Altura da linha',
      letterSpacing: 'Espaçamento entre letras',
      capitalization: 'Escrever de letra maiúscula',
      uppercase: 'MAIÚSCULAS',
      firstLetterOfEachWord: 'Primeira Letra De Cada Palavra',
      properNouns: 'Nomes ou substantivos próprios e o começo de sentenças',
      properNounsDescription:
        'Frases separadas são detectadas somente quando uma pontuação tipo "ponto final" ou "ponto de interrogação" são ditos literalmente em voz alta.',
      alignment: 'Alinhamento',
      horizontalAlignment: 'Alinhamento horizontal',
      verticalAlignment: 'Alinhamento vertical',
      full: 'Cheio',
      left: 'Esquerda',
      middle: 'Meio',
      right: 'Direita',
      top: 'Topo',
      bottom: 'Inferior',
      lowerThird: 'Terço inferior',
      padding: 'Preenchimento',
      background: 'Fundo',
      backgroundColor: 'Cor-de-fundo',
      backgroundOpacity: 'Opacidade do fundo',
      textShadow: 'Sombra-de-letras',
      shadowColor: 'Cor da sombra',
      opacity: 'Opacidade',
      blur: 'Borrar',
      xPosition: 'Posição X',
      yPosition: 'Posição Y',
    },
    censor: {
      censor: 'Censurar',
      censorProfaneLanguage: 'Censurar linguagem profana.',
      usEnglishOnly: 'Atualmente disponível apenas para inglês dos EUA.',
      censorProfaneLanguageDescription: {
        text:
          'O que é considerado profano? {seeThisList} (nota: palavrões à frente!) Se você precisar censurar palavras adicionais não incluídas nesta lista, {useWordReplacements}.',
        seeThisList: 'Veja esta lista',
        useWordReplacements: 'usar substituições de palavras',
      },
      replaceCensoredWordsWith: 'Substitua palavras censuradas com',
      nothing: 'nada — apenas omitem-nas',
      asterisks: 'asterisco',
    },
    controls: {
      controls: 'Controles',
      screenLayout: 'Layout da tela',
      default: 'Padrão',
      defaultDescription: 'Controles de tamanho normal',
      larger: 'Maior',
      largerDescription:
        'Controles maiores e botões adicionais para salvar e limpar a transcrição com um só clique',
      keyboardShortcuts: 'Atalhos',
      then: 'em seguida',
      ctrl: 'Ctrl',
      shift: 'Shift',
      toggleCaptioning: 'Ativar / desativar legendas',
      toggleFullscreen: 'Ativar / desativar o modo de tela cheia',
      showNewWindow: 'Mostrar legendas em uma nova janela',
      openSettings: 'Abrir configurações',
      increaseTextSize: 'Aumentar o tamanho do texto',
      decreaseTextSize: 'Diminuir o tamanho do texto',
      openSave: 'Abrir "@:captioner.saveToFile.title" diálogo',
      clearTranscript: 'Limpar transcrição',
      listKeyboardShortcuts: 'Listar atalhos de teclado',
    },
    language: {
      language: 'Idioma',
      interface: 'Idioma da interface do Web Captioner',
      interfaceDescription:
        'Selecione um idioma pra interface do Web Captioner (menus, mensagens e páginas de configurações).',
      wouldYouLikeYourLanguage:
        'Gostaria de ver sua língua aqui? {contactWebCaptionerOnFacebook} se estiver interessado em ajudar a traduzir o Web Captioner. Obrigado pelo suporte! {heartIcon}',
      contactWebCaptionerOnFacebook:
        'Entre em contato com o Web Captioner no Facebook',
      spoken: 'Idioma falado',
      spokenDescription: {
        text:
          'O Web Captioner reconhecerá a fala nesse idioma. Saiba mais sobre {supportedLanguagesAndDialects}.',
        supportedLanguagesAndDialects: 'idiomas e dialetos suportados',
      },
      list: {
        'en-US': 'Inglês (Estados Unidos)',
        'pt-BR': 'Português (Brasil)',
      },
    },
    remoteDisplays: {
      remoteDisplays: 'Displays remotos',
    },
    wordReplacements: {
      wordReplacements: 'Substituimento de palavras',
      description:
        'Substitua ou oculte palavras ou frases específicas durante as legendas.',
      wordOrPhraseToReplace: 'Palavra ou frase a serem substituídas',
      wordOrPhraseToReplaceSentenceCase:
        '@:settings.wordReplacements.wordOrPhraseToReplace',
      wordOrPhraseToReplaceDescription:
        'Separe várias palavras ou frases com vírgulas. Não diferencia maiúsculas de minúsculas.',
      replaceWith: 'Substituir com',
      replaceWithSentenceCase: '@:settings.wordReplacements.replaceWith',
      addAnother: 'Adicionar outra',
    },
    vmix: {
      vmix: 'vMix',
      description: {
        text:
          '{vMix} é um software misturador e switcher de vídeo popular. Você pode enviar texto diretamente para o vMix e exibi-lo em uma entrada de título. Você pode usar os controles de fonte e cor do vMix para estilizar o texto das legendas. {visitTheHelpCenter} para saber mais.',
        visitTheHelpCenter: 'Visite o centro de ajuda',
      },
      connectedToVmix: 'Conectado ao vMix!',
      connected: 'Conectado',
      captionsWillAppear:
        '{startCaptioning} e suas legendas aparecerão agora no vMix.',
      startCaptioning: 'Comece a legendar',
      connectToVmix: 'Conecte-se ao vMix',
      sendTestMessage: 'Enviar mensagem de teste',
      sent: 'Enviado!',
      step1: 'Passo 1',
      step2: 'Passo 2',
      step3: 'Passo 3',
      completeStep1First: 'Complete o passo 1 primeiro',
      completeStep2First: 'Complete o passo 2 primeiro',
      completeSteps1And2First: 'Complete as etapas 1 e 2 primeiro',
      installChromeExtension: 'Instalar extensão do Chrome',
      installChromeExtensionDescription:
        'A extensão do Web Captioner Connector para o Google Chrome permite que o Web Captioner se conecte ao vMix.',
      addToChrome: 'Adicionar ao Chrome',
      extensionInstalled: 'Extensão instalada',
      extensionNotInstalled: 'Extensão não instalada.',
      vmixWebController: 'Controlador vMix Web',
      webControllerAddress: 'Endereço do controlador da Web do vMix',
      webController: 'Controlador Web',
      enableVmixWebController: 'Ativar o controlador da Web vMix',
      enableVmixWebControllerInstructions:
        'No vMix, vá para {settingMenu}. Marque a caixa para ativar o {webController}. Especifique um número de porta ou aceite a padrão.',
      enableVmixWebControllerSettingMenu: 'Configurações > Controlador da Web',
      provideAddress: 'Forneça o endereço que aparece no vMix:',
      example: 'Exemplo:',
      cannotConnect:
        'Não é possível conectar-se ao vMix em "{webControllerAddress}". Lembre-se de que o Web Controller esteja ativado no vMix e que você tenha copiado o endereço do site corretamente. Deve ser algo mais ou menos assim: http://192.168.1.1:8080',
      import: 'Importar',
      importTitleTemplate: 'Importar modelo de template',
      webCaptionerTitleTemplate: 'Modelo de título Web Captioner',
      importTitleTemplateLonger:
        'Importar o modelo de título do Web Captioner para o vMix',
      importTitleTemplateInstructions: {
        i0: 'Faça o download do {webCaptionerTitleTemplate} para o vMix.',
        i1: 'No vMix, vá para {addInputSetting}.',
        i2:
          'Na janela {inputSelect}, clique em {browse} no canto superior direito e abra o modelo de título do Web Captioner que você baixou.',
        i3: 'O título aparecerá na guia {recent}. Clique duas vezes nela.',
        i4:
          'No editor de títulos que aparece, opcionalmente, personalize o tamanho da fonte e do texto. Feche quando terminar.',
      },
      cantFindTemplate:
        'O Web Captioner pode se conectar ao vMix, mas não pode encontrar o modelo de título do Web Captioner em uma entrada.',
      testAndFinishSetup: 'Teste e finalize a instalação',
    },
    webhooks: {
      webhooks: 'Webhooks',
    },
    exportRestore: {
      exportRestoreSettings: 'Exportar/Restaurar configurações',
      restore: 'Restaurar',
      restoreDescription:
        'Restaure as configurações (aparência, configurações do censor, substituições de palavras, configurações do vMix etc.) de um arquivo de configurações que você exportou e salvou anteriormente.',
      restoreSettingsQuestion: 'Restaurar configurações deste arquivo?',
      somethingWrongWithFile: 'Parece que algo tá errado com este arquivo.',
      restoredSettings: 'Configurações restauradas',
      reset: 'Restabelecer',
      resetDescription: 'Redefinir todas as configurações.',
      resetSettingsQuestion: 'Redefinir todas as configurações?',
      settingsWillBeLost: 'Todas as configurações atuais serão perdidas.',
      settingsReset: 'Redefinir configurações',
      export: 'Exportar',
      exportDescription:
        'Suas configurações serão salvas como um arquivo JSON.',
    },
  },
  incompatibleBrowser: {
    incompatibleBrowser: 'Navegador incompatível',
    message: {
      i0:
        'Desculpe, mas atualmente o Web Captioner só funciona no Google Chrome.',
      i1:
        'Ainda é possível explorar opções e fuçar com as configurações, mas para começar as legendas, você terá que {switchToGoogleChrome}.',
      i2:
        'Se a compatibilidade com navegadores que não sejam o Chrome for importante pra você, {castAVoteHere}.',
      switchToGoogleChrome: 'mudar para o Google Chrome',
      castAVoteHere: 'votar aqui',
    },
    whyJustChrome: 'Por que só o Chrome?',
    lookAroundAnyway: 'Explore mesmo assim',
  },
};

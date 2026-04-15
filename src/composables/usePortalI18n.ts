type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES'

const LANGUAGE_STORAGE_KEY = 'portal-language'
const DEFAULT_LOCALE: SupportedLocale = 'pt-BR'

const messages = {
  'pt-BR': {
    settingsPreferences: 'Preferencias',
    settingsTitle: 'Configuracoes',
    settingsDescription: 'Personalize notificacoes e experiencia na plataforma.',
    settingsAdjustments: 'ajustes',
    notificationsAndFocus: 'Notificacoes e foco',
    studentAccount: 'Conta do aluno',
    reportsTitle: 'Relatorios de desempenho',
    reportsDescription:
      'Receber notificacoes sobre progresso, desempenho e areas de melhoria via email.',
    accessibilityTitle: 'Acessibilidade',
    accessibilityDescription:
      'Recursos para melhorar a experiencia de usuarios com necessidades especiais, dicas e ajustes de interface.',
    languageTitle: 'Idioma preferido',
    languageDescription: 'Definir o idioma da interface para portugues, ingles ou espanhol.',
    themingTitle: 'Tematizacao',
    themingDescription: 'Personalizar a aparencia da plataforma com temas claros ou escuros.',
    saveConfigurations: 'Salvar Configuracoes',
    securityTitle: 'Seguranca',
    securityDescription: 'Atualize dados sensiveis e mantenha sua conta protegida.',
    confirmEmail: 'Confirmar email',
    emailModalTitle: 'Confirme seu e-mail',
    savedSuccess: 'Configuracoes salvas com sucesso.',
    saveError: 'Erro ao salvar configuracoes. Por favor, tente novamente.',
    enabled: 'Ativado',
    disabled: 'Desativado',
    sidebarTitle: 'Portal do Aluno',
    mobileMore: 'Mais',
    navDashboard: 'Dashboard',
    navDashboardShort: 'Home',
    navDashboardNote: 'Perfil, Medalhas e Relatorios',
    navNotifications: 'Notificacoes',
    navNotificationsShort: 'Avisos',
    navNotificationsNote: 'Inbox e comunicados',
    navGoals: 'Missões',
    navGoalsShort: 'Missões',
    navGoalsNote: 'Desafios, Pontos e Medalhas',
    navStudentTrack: 'Trilha do aluno',
    navStudentTrackShort: 'Trilha',
    navStudentTrackNote: 'Fluxo e Exercicios',
    navCoursesTrack: 'Trilha de cursos',
    navCoursesTrackShort: 'Cursos',
    navCoursesTrackNote: 'Cursos pagos e muito mais',
    navMaterial: 'Material adicional',
    navMaterialShort: 'Materiais',
    navMaterialNote: 'Documentos para atribuicoes',
    navVideos: 'Videos',
    navVideosShort: 'Videos',
    navVideosNote: 'Videos gerais',
    navSettings: 'Configuracoes',
    navLogout: 'Sair',
    appWhatsappMessage: 'Ola, quero tirar duvidas sobre o portal do aluno!!',
    appWhatsappMinimize: 'Minimizar WhatsApp',
    appWhatsappOpen: 'Abrir WhatsApp',
    notificationsHeroEyebrow: 'Inbox',
    notificationsHeroTitle: 'Notificacoes',
    notificationsHeroDescription: 'Avisos enviados pelo portal administrativo para sua conta.',
    notificationsUnread: 'Nao lidas',
    notificationsTotal: 'Total',
    notificationsMarkAllRead: 'Marcar todas como lidas',
    notificationsPersonalInbox: 'Inbox pessoal',
    notificationsStudentCenter: 'Central do aluno',
    notificationsStudentCenterDescription:
      'As notificacoes mais recentes aparecem primeiro e ficam salvas no seu historico.',
    notificationsSummary: 'Resumo',
    notificationsUnreadSingular: 'nao lida',
    notificationsUnreadPlural: 'nao lidas',
    notificationsOutOf: 'de',
    notificationsRefresh: 'Atualizar inbox',
    notificationsRefreshing: 'Atualizando...',
    notificationsInboxTab: 'Inbox',
    notificationsHistoryTab: 'Historico',
    notificationsSearchPlaceholder: 'Buscar por titulo, mensagem, template, curso ou turma',
    notificationsShowing: 'Exibindo',
    notificationsScrollMore: 'Role para carregar mais notificacoes.',
    notificationsClearSearch: 'Limpar busca',
    notificationsLoadingTitle: 'Carregando notificacoes...',
    notificationsLoadingDescription: 'Buscando os avisos mais recentes para sua caixa de entrada.',
    notificationsEmptyTitle: 'Nenhuma notificacao recebida.',
    notificationsEmptyDescription:
      'Quando um aviso for enviado pelo portal administrativo, ele aparecera aqui.',
    notificationsNoResultsTitle: 'Nenhum resultado encontrado.',
    notificationsNoResultsDescription:
      'Tente outro termo ou limpe a busca para ver todas as notificacoes desta aba.',
    notificationsNoPendingTitle: 'Nenhuma notificação pendente.',
    notificationsNoPendingDescription:
      'Quando houver novos avisos nao lidos, eles aparecerao aqui.',
    notificationsNoHistoryTitle: 'Nenhuma notificação no historico.',
    notificationsNoHistoryDescription:
      'As notificacoes lidas ficarao organizadas aqui para consulta.',
    notificationsStatusRead: 'Lida',
    notificationsStatusNew: 'Nova',
    notificationsCourse: 'Curso',
    notificationsClass: 'Turma',
    notificationsMarkAsRead: 'Marcar como lida',
    notificationsLoadErrorTitle: 'Erro ao carregar notificacoes',
    notificationsUpdateErrorTitle: 'Erro ao atualizar notificação',
    notificationsInboxUpdateErrorTitle: 'Erro ao atualizar inbox',
    notificationsTryAgain: 'Tente novamente.',
    notificationsInboxUpdatedTitle: 'Inbox atualizada',
    notificationsInboxUpdatedDescription: 'Todas as notificacoes foram marcadas como lidas.',
  },
  'en-US': {
    settingsPreferences: 'Preferences',
    settingsTitle: 'Settings',
    settingsDescription: 'Customize notifications and your platform experience.',
    settingsAdjustments: 'adjustments',
    notificationsAndFocus: 'Notifications and focus',
    studentAccount: 'Student account',
    reportsTitle: 'Performance reports',
    reportsDescription:
      'Receive notifications about progress, performance, and improvement areas by email.',
    accessibilityTitle: 'Accessibility',
    accessibilityDescription:
      'Features to improve the experience for users with special needs, plus interface tips and adjustments.',
    languageTitle: 'Preferred language',
    languageDescription: 'Set the interface language to Portuguese, English, or Spanish.',
    themingTitle: 'Theme',
    themingDescription: 'Customize the platform look with light or dark themes.',
    saveConfigurations: 'Save Settings',
    securityTitle: 'Security',
    securityDescription: 'Update sensitive data and keep your account protected.',
    confirmEmail: 'Confirm email',
    emailModalTitle: 'Confirm your email',
    savedSuccess: 'Settings saved successfully.',
    saveError: 'Error while saving settings. Please try again.',
    enabled: 'Enabled',
    disabled: 'Disabled',
    sidebarTitle: 'Student Portal',
    mobileMore: 'More',
    navDashboard: 'Dashboard',
    navDashboardShort: 'Home',
    navDashboardNote: 'Profile, badges and reports',
    navNotifications: 'Notifications',
    navNotificationsShort: 'Inbox',
    navNotificationsNote: 'Inbox and announcements',
    navGoals: 'Missions',
    navGoalsShort: 'Missions',
    navGoalsNote: 'Challenges, points and badges',
    navStudentTrack: 'Student path',
    navStudentTrackShort: 'Path',
    navStudentTrackNote: 'Flow and exercises',
    navCoursesTrack: 'Courses path',
    navCoursesTrackShort: 'Courses',
    navCoursesTrackNote: 'Paid courses and more',
    navMaterial: 'Additional material',
    navMaterialShort: 'Materials',
    navMaterialNote: 'Assignment documents',
    navVideos: 'Videos',
    navVideosShort: 'Videos',
    navVideosNote: 'General videos',
    navSettings: 'Settings',
    navLogout: 'Sign out',
    appWhatsappMessage: 'Hello, I want help with the student portal!!',
    appWhatsappMinimize: 'Minimize WhatsApp',
    appWhatsappOpen: 'Open WhatsApp',
    notificationsHeroEyebrow: 'Inbox',
    notificationsHeroTitle: 'Notifications',
    notificationsHeroDescription: 'Messages sent by the admin portal to your account.',
    notificationsUnread: 'Unread',
    notificationsTotal: 'Total',
    notificationsMarkAllRead: 'Mark all as read',
    notificationsPersonalInbox: 'Personal inbox',
    notificationsStudentCenter: 'Student center',
    notificationsStudentCenterDescription:
      'The latest notifications appear first and remain saved in your history.',
    notificationsSummary: 'Summary',
    notificationsUnreadSingular: 'unread',
    notificationsUnreadPlural: 'unread',
    notificationsOutOf: 'of',
    notificationsRefresh: 'Refresh inbox',
    notificationsRefreshing: 'Refreshing...',
    notificationsInboxTab: 'Inbox',
    notificationsHistoryTab: 'History',
    notificationsSearchPlaceholder: 'Search by title, message, template, course or class',
    notificationsShowing: 'Showing',
    notificationsScrollMore: 'Scroll to load more notifications.',
    notificationsClearSearch: 'Clear search',
    notificationsLoadingTitle: 'Loading notifications...',
    notificationsLoadingDescription: 'Fetching the latest messages for your inbox.',
    notificationsEmptyTitle: 'No notifications received.',
    notificationsEmptyDescription:
      'When a message is sent from the admin portal, it will appear here.',
    notificationsNoResultsTitle: 'No results found.',
    notificationsNoResultsDescription:
      'Try another term or clear the search to see all notifications in this tab.',
    notificationsNoPendingTitle: 'No pending notifications.',
    notificationsNoPendingDescription: 'When new unread messages arrive, they will appear here.',
    notificationsNoHistoryTitle: 'No notifications in history.',
    notificationsNoHistoryDescription:
      'Read notifications will stay organized here for consultation.',
    notificationsStatusRead: 'Read',
    notificationsStatusNew: 'New',
    notificationsCourse: 'Course',
    notificationsClass: 'Class',
    notificationsMarkAsRead: 'Mark as read',
    notificationsLoadErrorTitle: 'Error loading notifications',
    notificationsUpdateErrorTitle: 'Error updating notification',
    notificationsInboxUpdateErrorTitle: 'Error updating inbox',
    notificationsTryAgain: 'Please try again.',
    notificationsInboxUpdatedTitle: 'Inbox updated',
    notificationsInboxUpdatedDescription: 'All notifications have been marked as read.',
  },
  'es-ES': {
    settingsPreferences: 'Preferencias',
    settingsTitle: 'Configuracion',
    settingsDescription: 'Personaliza notificaciones y tu experiencia en la plataforma.',
    settingsAdjustments: 'ajustes',
    notificationsAndFocus: 'Notificaciones y foco',
    studentAccount: 'Cuenta del estudiante',
    reportsTitle: 'Reportes de rendimiento',
    reportsDescription:
      'Recibe notificaciones por correo sobre progreso, rendimiento y areas de mejora.',
    accessibilityTitle: 'Accesibilidad',
    accessibilityDescription:
      'Recursos para mejorar la experiencia de usuarios con necesidades especiales, ademas de consejos y ajustes de interfaz.',
    languageTitle: 'Idioma preferido',
    languageDescription: 'Define el idioma de la interfaz en portugues, ingles o espanol.',
    themingTitle: 'Tema',
    themingDescription: 'Personaliza la apariencia de la plataforma con temas claros u oscuros.',
    saveConfigurations: 'Guardar Configuracion',
    securityTitle: 'Seguridad',
    securityDescription: 'Actualiza datos sensibles y manten tu cuenta protegida.',
    confirmEmail: 'Confirmar correo',
    emailModalTitle: 'Confirma tu correo',
    savedSuccess: 'Configuracion guardada con exito.',
    saveError: 'Error al guardar la configuracion. Intentalo de nuevo.',
    enabled: 'Activado',
    disabled: 'Desactivado',
    sidebarTitle: 'Portal del Estudiante',
    mobileMore: 'Mas',
    navDashboard: 'Panel',
    navDashboardShort: 'Inicio',
    navDashboardNote: 'Perfil, medallas y reportes',
    navNotifications: 'Notificaciones',
    navNotificationsShort: 'Avisos',
    navNotificationsNote: 'Bandeja y comunicados',
    navGoals: 'Misiones',
    navGoalsShort: 'Misiones',
    navGoalsNote: 'Desafíos, puntos y medallas',
    navStudentTrack: 'Ruta del estudiante',
    navStudentTrackShort: 'Ruta',
    navStudentTrackNote: 'Flujo y ejercicios',
    navCoursesTrack: 'Ruta de cursos',
    navCoursesTrackShort: 'Cursos',
    navCoursesTrackNote: 'Cursos pagos y mas',
    navMaterial: 'Material adicional',
    navMaterialShort: 'Materiales',
    navMaterialNote: 'Documentos para tareas',
    navVideos: 'Videos',
    navVideosShort: 'Videos',
    navVideosNote: 'Videos generales',
    navSettings: 'Configuracion',
    navLogout: 'Salir',
    appWhatsappMessage: 'Hola, quiero ayuda con el portal del estudiante!!',
    appWhatsappMinimize: 'Minimizar WhatsApp',
    appWhatsappOpen: 'Abrir WhatsApp',
    notificationsHeroEyebrow: 'Bandeja',
    notificationsHeroTitle: 'Notificaciones',
    notificationsHeroDescription: 'Avisos enviados por el portal administrativo a tu cuenta.',
    notificationsUnread: 'No leidas',
    notificationsTotal: 'Total',
    notificationsMarkAllRead: 'Marcar todas como leidas',
    notificationsPersonalInbox: 'Bandeja personal',
    notificationsStudentCenter: 'Central del estudiante',
    notificationsStudentCenterDescription:
      'Las notificaciones mas recientes aparecen primero y quedan guardadas en tu historial.',
    notificationsSummary: 'Resumen',
    notificationsUnreadSingular: 'no leida',
    notificationsUnreadPlural: 'no leidas',
    notificationsOutOf: 'de',
    notificationsRefresh: 'Actualizar bandeja',
    notificationsRefreshing: 'Actualizando...',
    notificationsInboxTab: 'Bandeja',
    notificationsHistoryTab: 'Historial',
    notificationsSearchPlaceholder: 'Buscar por titulo, mensaje, plantilla, curso o clase',
    notificationsShowing: 'Mostrando',
    notificationsScrollMore: 'Desplazate para cargar mas notificaciones.',
    notificationsClearSearch: 'Limpiar busqueda',
    notificationsLoadingTitle: 'Cargando notificaciones...',
    notificationsLoadingDescription: 'Buscando los avisos mas recientes para tu bandeja.',
    notificationsEmptyTitle: 'No se recibieron notificaciones.',
    notificationsEmptyDescription:
      'Cuando se envie un aviso desde el portal administrativo, aparecera aqui.',
    notificationsNoResultsTitle: 'No se encontraron resultados.',
    notificationsNoResultsDescription:
      'Prueba otro termino o limpia la busqueda para ver todas las notificaciones de esta pestaña.',
    notificationsNoPendingTitle: 'No hay notificaciones pendientes.',
    notificationsNoPendingDescription: 'Cuando lleguen nuevos avisos no leidos, apareceran aqui.',
    notificationsNoHistoryTitle: 'No hay notificaciones en el historial.',
    notificationsNoHistoryDescription:
      'Las notificaciones leidas quedaran organizadas aqui para consulta.',
    notificationsStatusRead: 'Leida',
    notificationsStatusNew: 'Nueva',
    notificationsCourse: 'Curso',
    notificationsClass: 'Clase',
    notificationsMarkAsRead: 'Marcar como leida',
    notificationsLoadErrorTitle: 'Error al cargar notificaciones',
    notificationsUpdateErrorTitle: 'Error al actualizar la notificacion',
    notificationsInboxUpdateErrorTitle: 'Error al actualizar la bandeja',
    notificationsTryAgain: 'Intentalo de nuevo.',
    notificationsInboxUpdatedTitle: 'Bandeja actualizada',
    notificationsInboxUpdatedDescription: 'Todas las notificaciones fueron marcadas como leidas.',
  },
} as const

type MessageKey = keyof (typeof messages)['pt-BR']

function isSupportedLocale(value: string): value is SupportedLocale {
  return value === 'pt-BR' || value === 'en-US' || value === 'es-ES'
}

export function normalizePreferredLanguage(value: string | null | undefined): SupportedLocale {
  if (!value) {
    return DEFAULT_LOCALE
  }

  if (isSupportedLocale(value)) {
    return value
  }

  const normalized = value.trim().toLowerCase()

  if (
    normalized === 'portuguese' ||
    normalized === 'portugues' ||
    normalized === 'pt' ||
    normalized === 'pt-br'
  ) {
    return 'pt-BR'
  }

  if (normalized === 'english' || normalized === 'en' || normalized === 'en-us') {
    return 'en-US'
  }

  if (
    normalized === 'spanish' ||
    normalized === 'espanol' ||
    normalized === 'es' ||
    normalized === 'es-es'
  ) {
    return 'es-ES'
  }

  return DEFAULT_LOCALE
}

function resolveInitialLocale(): SupportedLocale {
  if (!import.meta.client) {
    return DEFAULT_LOCALE
  }

  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return normalizePreferredLanguage(stored)
}

function applyLocaleOnDocument(locale: SupportedLocale) {
  if (!import.meta.client) {
    return
  }

  document.documentElement.lang = locale
  localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
}

export function usePortalI18n() {
  const locale = useState<SupportedLocale>('portal-locale', resolveInitialLocale)

  function setLocale(value: string | null | undefined) {
    const nextLocale = normalizePreferredLanguage(value)

    locale.value = nextLocale
    applyLocaleOnDocument(nextLocale)
  }

  function t(key: MessageKey) {
    return messages[locale.value]?.[key] ?? messages[DEFAULT_LOCALE][key]
  }

  return {
    locale,
    setLocale,
    t,
  }
}

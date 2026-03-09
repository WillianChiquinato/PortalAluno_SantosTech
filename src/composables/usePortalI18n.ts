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

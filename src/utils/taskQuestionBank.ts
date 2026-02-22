export type ExerciseQuestionSource = {
  id: number
  title: string
  description: string
  pointsRedeem: number
  typeExercise: number
  difficulty: number
}

export type QuizQuestionOption = {
  id: number
  questionId: number
  question: string
  correctAnswer: boolean
}

export type QuizQuestion = {
  id: number
  statement: string
  options: string[]
  correctOptionIndex: number
}

type QuestionTemplate = {
  matcher: (task: ExerciseQuestionSource) => boolean
  options: string[]
  correctOptionIndex: number
}

const questionTemplates: QuestionTemplate[] = [
  {
    matcher: (task) => {
      const normalized = `${task.title} ${task.description}`.toLowerCase()
      return normalized.includes('http') && normalized.includes('atualizar parcialmente')
    },
    options: ['GET', 'POST', 'PATCH', 'DELETE'],
    correctOptionIndex: 2,
  },
  {
    matcher: (task) => {
      const normalized = `${task.title} ${task.description}`.toLowerCase()
      return normalized.includes('entity framework') && normalized.includes('migration')
    },
    options: [
      'dotnet ef migrations add <NomeDaMigration>',
      'dotnet ef database update',
      'dotnet new migration <NomeDaMigration>',
      'dotnet ef migrate create',
    ],
    correctOptionIndex: 0,
  },
]

function getQuestionTemplate(task: ExerciseQuestionSource): QuestionTemplate | null {
  for (const template of questionTemplates) {
    if (template.matcher(task)) {
      return template
    }
  }

  return null
}

export function buildTaskQuestions(task: ExerciseQuestionSource): QuizQuestion[] {
  const template = getQuestionTemplate(task)

  const QuestionDataTemplate: QuizQuestion = {
    id: task.id * 10 + 1,
    statement: task.description,
    options: template?.options ?? ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
    correctOptionIndex: template?.correctOptionIndex ?? 0,
  }

  return [QuestionDataTemplate]
}

export function buildTaskQuestionsFromOptions(
  task: ExerciseQuestionSource,
  options: QuizQuestionOption[],
): QuizQuestion[] {
  if (!options.length) {
    return buildTaskQuestions(task)
  }

  const groupedByQuestionId = new Map<number, QuizQuestionOption[]>()

  for (const option of options) {
    if (!groupedByQuestionId.has(option.questionId)) {
      groupedByQuestionId.set(option.questionId, [])
    }

    groupedByQuestionId.get(option.questionId)?.push(option)
  }

  const entries = Array.from(groupedByQuestionId.entries()).sort((a, b) => a[0] - b[0])

  return entries.map(([questionId, groupedOptions], index) => {
    const correctOptionIndex = groupedOptions.findIndex((item) => item.correctAnswer)

    return {
      id: questionId || task.id * 10 + index + 1,
      statement: index === 0 ? task.description : `Pergunta ${index + 1}`,
      options: groupedOptions.map((item) => item.question),
      correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
    }
  })
}

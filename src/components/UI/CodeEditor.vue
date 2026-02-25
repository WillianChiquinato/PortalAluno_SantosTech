<template>
    <div ref="host" class="code-editor-host"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, placeholder } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'

const props = withDefaults(
    defineProps<{
        modelValue: string
        placeholder?: string
    }>(),
    {
        modelValue: '',
        placeholder: 'Digite seu código aqui...',
    },
)

const emit = defineEmits<{
    (event: 'update:modelValue', value: string): void
}>()

const host = ref<HTMLDivElement | null>(null)
let editorView: EditorView | null = null

function createEditor() {
    if (!host.value || editorView) {
        return
    }

    const updateListener = EditorView.updateListener.of((update) => {
        if (!update.docChanged) {
            return
        }

        emit('update:modelValue', update.state.doc.toString())
    })

    const state = EditorState.create({
        doc: props.modelValue,
        extensions: [
            basicSetup,
            html(),
            EditorView.lineWrapping,
            placeholder(props.placeholder),
            updateListener,
        ],
    })

    editorView = new EditorView({
        state,
        parent: host.value,
    })
}

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editorView) {
            return
        }

        const currentValue = editorView.state.doc.toString()
        if (newValue === currentValue) {
            return
        }

        editorView.dispatch({
            changes: {
                from: 0,
                to: currentValue.length,
                insert: newValue,
            },
        })
    },
)

onMounted(() => {
    if (!import.meta.client) {
        return
    }

    createEditor()
})

onBeforeUnmount(() => {
    if (!editorView) {
        return
    }

    editorView.destroy()
    editorView = null
})
</script>

<style scoped lang="scss">
.code-editor-host {
    min-height: 260px;
    border: 1px solid rgba(254, 202, 202, 0.8);
    border-radius: 0.75rem;
    overflow: hidden;
    background: #fff;
}

.code-editor-host:deep(.cm-editor) {
    min-height: 260px;
    height: 100%;
}

.code-editor-host:deep(.cm-scroller) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
}

.code-editor-host:deep(.cm-focused) {
    outline: none;
}

.code-editor-host:deep(.cm-content) {
    padding: 12px 14px;
}

.code-editor-host:deep(.cm-gutters) {
    border-right: 1px solid rgba(254, 202, 202, 0.65);
    background: rgba(254, 242, 242, 0.5);
}
</style>

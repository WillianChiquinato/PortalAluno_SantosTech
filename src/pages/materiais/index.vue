<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">Biblioteca</p>
                        <h2 class="text-2xl font-semibold text-tag-100">Materiais de apoio</h2>
                        <p class="mt-1 text-sm text-tag-100/80">Documentações e referências técnicas da trilha.</p>
                    </div>

                    <span
                        class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-tag-100">
                        {{ filteredMaterials.length }} material(is)
                    </span>
                </div>
            </div>
        </section>

        <section v-if="materials.length" class="panel p-4">
            <div class="flex flex-wrap items-center gap-2">
                <button v-for="type in materialTypes" :key="type" class="chip cursor-pointer transition"
                    :class="selectedType === type ? '!border-brand-500 !bg-red-50 !text-brand-600' : ''"
                    @click="selectedType = type">
                    {{ type === 'all' ? 'Todos' : type }}
                </button>
            </div>
        </section>

        <section v-if="filteredMaterials.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <MaterialCard v-for="material in filteredMaterials" :key="material.id" v-bind="material" />
        </section>

        <section v-else class="panel p-8 text-center">
            <p class="text-base font-semibold">
                {{ materials.length ? 'Nenhum material encontrado para este tipo.' : 'Nenhum material disponível no momento.' }}
            </p>
            <p class="mt-1 text-sm text-ink-500">
                {{ materials.length ? 'Selecione outro tipo para visualizar mais documentos.' : 'Assim que novos documentos forem publicados, eles vão aparecer aqui.' }}
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import MaterialCard from '@/components/MaterialCard.vue'
import type { IMaterial } from '~/infra/interfaces/services/material';

const materials = ref<IMaterial[]>([]);
const selectedType = ref<'all' | string>('all');

const materialTypes = computed(() => {
    const types = new Set<string>(['all']);

    for (const material of materials.value) {
        const normalizedType = String(material.fileType || '').trim().toUpperCase();
        if (normalizedType) {
            types.add(normalizedType);
        }
    }

    return Array.from(types);
});

const filteredMaterials = computed(() => {
    if (selectedType.value === 'all') {
        return materials.value;
    }

    return materials.value.filter((material) => {
        return String(material.fileType || '').trim().toUpperCase() === selectedType.value;
    });
});

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();

async function fetchMaterials() {
    loadingPush();

    try {
        const response = await $httpClient.material.GetAllMaterials()

        if (response.success) {
            materials.value = response.result;
            toast.success('Materiais carregados com sucesso!')
        } else {
            toast.error('Não foi possível carregar os materiais. Tente novamente mais tarde.')
        }
    } catch (error) {
        console.error('Erro ao buscar materiais:', error)
        toast.error('Não foi possível carregar os materiais. Tente novamente mais tarde.')
    } finally {
        loadingPop()
    }
}

onMounted(async () => {
    await fetchMaterials();
})
</script>
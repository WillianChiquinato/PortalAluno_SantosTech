<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">{{
                            t('settingsPreferences') }}</p>
                        <h2 class="text-2xl font-semibold text-tag-100">{{ t('settingsTitle') }}</h2>
                        <p class="mt-1 text-sm text-tag-100/80">{{ t('settingsDescription') }}
                        </p>
                    </div>

                    <span
                        class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-tag-100/80">
                        {{ toggles.length }} {{ t('settingsAdjustments') }}
                    </span>
                </div>
            </div>
        </section>

        <section class="panel p-5 space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">{{ t('notificationsAndFocus') }}</h3>
                <span class="chip">{{ t('studentAccount') }}</span>
            </div>

            <div class="grid gap-3">
                <SettingToggle v-for="toggle in toggles" :key="toggle.title" v-bind="toggle"
                    :enabled-label="t('enabled')" :disabled-label="t('disabled')"
                    @update:enabled="(value) => onToggleChange(toggle.id, value)" @changeLanguage="onLanguageChange" />
            </div>

            <div class="flex gap-3 justify-end">
                <button class="btn-primary text-ink-900 px-4 text-sm cursor-pointer" @click="saveConfigurations">{{
                    t('saveConfigurations') }}</button>
            </div>
        </section>

        <section class="panel flex flex-col gap-4 p-6">
            <h3 class="text-lg font-semibold">{{ t('securityTitle') }}</h3>
            <p class="text-sm text-ink-500">{{ t('securityDescription') }}</p>
            <div class="flex flex-wrap items-center gap-3">
                <button
                    class="text-ink-900 btn-primary h-10 px-4 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="showModalConfirmedEmail = true" :disabled="!userConfigs.receiveEmailNotifications">{{
                        t('confirmEmail') }}</button>
            </div>

            <SendEmailModal v-model:visible="showModalConfirmedEmail" :name="t('emailModalTitle')"
                @back="showModalConfirmedEmail = false" />
        </section>
    </div>
</template>

<script setup lang="ts">
import SettingToggle from '@/components/SettingToggle.vue'
import { computed, onMounted, reactive, watch } from 'vue'
import type { IAuthConfigUserUpdateRequest } from '~/infra/interfaces/services/auth';
import { getUserIdFromSession, useLoadingConfigurations } from '~/composables/useLoadingConfigurations';

import SendEmailModal from '@/components/Modals/SendEmailModal.vue';
import { useUserStore } from '~/infra/store/userStore';
import { usePortalI18n } from '~/composables/usePortalI18n';

const userConfigs = useUserStore();
const { t, setLocale } = usePortalI18n();
const showModalConfirmedEmail = ref(false);
const codeDigits = ref<string[]>(Array(6).fill(''));
const codeInputRefs = ref<(HTMLInputElement | null)[]>([]);

function setCodeInputRef(idx: number) {
    return (el: Element | import('vue').ComponentPublicInstance | null) => {
        codeInputRefs.value[idx] = el as HTMLInputElement | null;
    };
}

function onInput(idx: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');
    if (val.length > 1) val = val.slice(-1);
    codeDigits.value[idx] = val;
    if (val && idx < codeDigits.value.length - 1) {
        nextTick(() => codeInputRefs.value[idx + 1]?.focus());
    }
}

function onBackspace(idx: number, event: KeyboardEvent) {
    if (!codeDigits.value[idx] && idx > 0) {
        nextTick(() => codeInputRefs.value[idx - 1]?.focus());
    }
}

function onPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/^\d{6}$/.test(paste)) {
        for (let i = 0; i < 6; i++) {
            codeDigits.value[i] = paste[i];
        }
        nextTick(() => codeInputRefs.value[5]?.focus());
        event.preventDefault();
    }
}

function confirmCode() {
    const code = codeDigits.value.join('');
    // lógica para enviar o código
}

function resendCode() {
    // lógica para reenviar o código
}
const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const { loadConfigurations } = useLoadingConfigurations();
const toast = useToastService();

type SettingItem = {
    id: 'reports' | 'accessibility' | 'language' | 'theme'
    title: string
    description: string
    enabled?: boolean
    selectedLanguage?: string
    variant?: 'default' | 'theme-lottie' | 'language'
}

const form = reactive({
    receiveEmailNotifications: userConfigs.getReceiveEmailNotifications,
    darkModeEnabled: userConfigs.getDarkModeEnabled,
    reportFrequency: userConfigs.getReportFrequency,
    acessibilityMode: userConfigs.getAcessibilityMode,
    preferredLanguage: userConfigs.getPreferredLanguage,
})

function hydrateFormFromStore() {
    form.receiveEmailNotifications = userConfigs.getReceiveEmailNotifications
    form.darkModeEnabled = userConfigs.getDarkModeEnabled
    form.reportFrequency = userConfigs.getReportFrequency
    form.acessibilityMode = userConfigs.getAcessibilityMode
    form.preferredLanguage = userConfigs.getPreferredLanguage
}

const toggles = computed<SettingItem[]>(() => [
    {
        id: 'reports',
        title: t('reportsTitle'),
        description: t('reportsDescription'),
        enabled: form.reportFrequency,
    },
    {
        id: 'accessibility',
        title: t('accessibilityTitle'),
        description: t('accessibilityDescription'),
        enabled: form.acessibilityMode,
    },
    {
        id: 'language',
        title: t('languageTitle'),
        description: t('languageDescription'),
        selectedLanguage: form.preferredLanguage,
        variant: 'language',
    },
    {
        id: 'theme',
        title: t('themingTitle'),
        description: t('themingDescription'),
        enabled: form.darkModeEnabled,
        variant: 'theme-lottie',
    },
])

function onToggleChange(toggleKey: SettingItem['id'], value: boolean) {
    if (toggleKey === 'reports') form.reportFrequency = value
    if (toggleKey === 'accessibility') form.acessibilityMode = value
    if (toggleKey === 'theme') form.darkModeEnabled = value
}

function onLanguageChange(value: string) {
    form.preferredLanguage = value
    userConfigs.setPreferredLanguage(value)
    setLocale(value)
}

watch(
    () => userConfigs.getConfigurationsLoaded,
    (loaded) => {
        if (!loaded) {
            return
        }

        hydrateFormFromStore()
    },
    { immediate: true },
)

onMounted(async () => {
    if (!userConfigs.getConfigurationsLoaded) {
        await loadConfigurations()
    }

    if (userConfigs.getConfigurationsLoaded) {
        hydrateFormFromStore()
    }
})

async function saveConfigurations() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        const payloadConfigs: IAuthConfigUserUpdateRequest = {
            userId: userId ?? 0,
            receiveEmailNotifications: form.receiveEmailNotifications,
            darkModeEnabled: form.darkModeEnabled,
            reportFrequency: form.reportFrequency,
            acessibilityMode: form.acessibilityMode,
            preferredLanguage: form.preferredLanguage,
        }

        const responseConfig = await $httpClient.auth.UpdateConfigurations(payloadConfigs)

        if (responseConfig.result) {
            userConfigs.setReceiveEmailNotifications(form.receiveEmailNotifications)
            userConfigs.setDarkModeEnabled(form.darkModeEnabled)
            userConfigs.setReportFrequency(form.reportFrequency)
            userConfigs.setAcessibilityMode(form.acessibilityMode)
            userConfigs.setPreferredLanguage(form.preferredLanguage)
            userConfigs.setConfigurationsLoaded(true)
            setLocale(form.preferredLanguage)
            toast.success(t('savedSuccess'));
        }
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        toast.error(t('saveError'));
    } finally {
        loadingPop();
    }
}
</script>
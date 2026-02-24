<template>
    <ClickEffect />
    <AppToast />
    <div>
        <NotificationEmail v-if="showNotificationEmail" :email="loggedUserEmail" class="Notification-Toast" />
        <LoadingScreen v-if="isLoading" class="loading-overlay" />

        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>

    <transition name="whatsapp-fade">
        <div v-if="showWhatsapp && !isWhatsappMinimized" class="whatsapp-container-float">
            <a :href="`https://wa.me/+5511986652872?text=Olá, quero tirar duvidas sobre o portal do aluno!!`"
                target="_blank" class="whatsapp-float">
                <i class="pi pi-whatsapp whatsapp-icon"></i>
            </a>

            <button @click="isWhatsappMinimized = true" class="whatsapp-close-btn" title="Minimizar WhatsApp">
                <i class="pi pi-times"></i>
            </button>
        </div>
    </transition>

    <transition name="arrow-slide">
        <button v-if="showWhatsapp && isWhatsappMinimized" @click="isWhatsappMinimized = false"
            class="whatsapp-arrow-btn" title="Abrir WhatsApp">
            <i class="pi pi-chevron-left"></i>
        </button>
    </transition>
</template>

<script setup lang="ts">
import LoadingScreen from '~/components/UI/LoadingScreen.vue';
import AppToast from './components/Toast/AppToast.vue';
import ClickEffect from './components/ClickEffect.vue';
import NotificationEmail from './components/Toast/NotificationEmail.vue';
import { useLoadingConfigurations } from './composables/useLoadingConfigurations';
import { getLoggedUser, verifyToken } from './composables/useAuth';
import { useUserStore } from './infra/store/userStore';

const userConfigs = useUserStore()
const { isLoading } = useLoading();
const { loadConfigurations } = useLoadingConfigurations();
const loggedUserEmail = computed(() => {
    return getLoggedUser()?.email ?? ''
})

const showNotificationEmail = computed(() => {
    if (!verifyToken() || !userConfigs.getConfigurationsLoaded) {
        return false
    }

    return userConfigs.getReceiveEmailNotifications === false
})

const isWhatsappMinimized = ref(false);
const showWhatsapp = computed(() => {
    return true;
});

onMounted(async () => {
    if (!verifyToken()) {
        return;
    }

    await loadConfigurations();
});

</script>

<style scoped lang="scss">
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(26, 18, 3, 0.8);
    backdrop-filter: blur(13px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.Notification-Toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
}

.whatsapp-container-float {
    position: fixed;
    bottom: 40px;
    right: 40px;
    z-index: 1000;

    @media (max-width: 1000px) {
        bottom: 70px;
        right: 20px;
    }
}

.whatsapp-float {
    text-decoration: none;
    width: 60px;
    height: 60px;
    background-color: #25d366;
    color: #FFF;
    border-radius: 50px;
    text-align: center;
    font-size: 30px;
    box-shadow: 2px 2px 3px #999;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
}

.whatsapp-float:hover {
    background-color: #128c7e;
    color: #FFF;
    transform: scale(1.1);
}

.whatsapp-icon {
    font-size: 1.85rem;
}

.whatsapp-close-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background-color: #dc3545;
    color: #FFF;
    border: 2px solid #FFF;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s ease-in-out;
    z-index: 1001;
}

.whatsapp-close-btn:hover {
    background-color: #c82333;
    transform: scale(1.1);
}

.whatsapp-arrow-btn {
    position: fixed;
    bottom: 50%;
    right: 0;
    width: 32px;
    height: 60px;
    background-color: #25d366;
    color: #FFF;
    border: none;
    border-radius: 8px 0 0 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    z-index: 1000;
    transform: translateY(50%);
}

.whatsapp-arrow-btn:hover {
    background-color: #128c7e;
    width: 36px;
    box-shadow: -3px 3px 8px rgba(0, 0, 0, 0.3);
}

.whatsapp-fade-enter-active,
.whatsapp-fade-leave-active {
    transition: all 0.3s ease;
}

.whatsapp-fade-enter-from {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
}

.whatsapp-fade-leave-to {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
}

.arrow-slide-enter-active,
.arrow-slide-leave-active {
    transition: all 0.3s ease;
}

.arrow-slide-enter-from {
    opacity: 0;
    transform: translateX(50px);
}

.arrow-slide-leave-to {
    opacity: 0;
    transform: translateX(50px);
}
</style>

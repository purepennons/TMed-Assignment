<script>
import bgImgURL from '@/assets/bg.jpeg'

export default {
    name: 'ResetPasswordView',
    components: {},
    data() {
        return {
            bgImgURL
        }
    }
}
</script>
<template>
    <div
        class="reset-password-page container-fluid"
        :style="{ backgroundImage: `url(${bgImgURL})`, backgroundSize: 'cover'}"
    >
        Reset Password View
    </div>
</template>
<style lang="scss" scoped>
.reset-password-page {
    width: 100vw;
    height: 100vh;
    
}
</style>

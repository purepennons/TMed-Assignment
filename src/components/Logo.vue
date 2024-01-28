<script>
import logoImgURL from '@/assets/TMedTech-logo.png'

export default {
    name: 'TMedLogo',
    data() {
        return {
            logoImgURL
        }
    }
}
</script>
<template>
    <div class="logo d-flex justify-content-center">
        <img :src="logoImgURL" alt="TMedTech" />
        <span>Portal</span>
    </div>
</template>
<style lang="scss" scoped>
.logo {
    max-height: 34px;
    color: #0e1123;
    font-style: normal;
    font-weight: 400;
    margin: 95px 0 34px 0;

    > span,
    img {
        vertical-align: baseline;
    }

    > span {
        font-family: 'Poppins';
        font-size: 33px;
        margin-top: 8px;
        margin-left: -9px;
    }
}
</style>

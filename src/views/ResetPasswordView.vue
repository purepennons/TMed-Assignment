<script>
import { RouterLink } from 'vue-router'

import LeftArrowIcon from '@/components/icons/IconLeftArrow.vue'
import CheckCircleIcon from '@/components/icons/IconCheckCircle.vue'
import CrossCircleIcon from '@/components/icons/IconCrossCircle.vue'
import LockIcon from '@/components/icons/IconLock.vue'

import bgImgURL from '@/assets/bg.jpeg'
import logoImgURL from '@/assets/TMedTech-logo-l.jpg'

export default {
    name: 'ResetPasswordView',
    components: {
        LeftArrowIcon,
        RouterLink,
        CheckCircleIcon,
        CrossCircleIcon,
        LockIcon
    },
    data() {
        return {
            bgImgURL,
            logoImgURL
        }
    }
}
</script>
<template>
    <div
        class="reset-password-page container-fluid justify-content-center align-items-center"
        :style="{
            backgroundImage: `url(${bgImgURL})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }"
    >
        <RouterLink class="go-home-btn" to="/">
            <LeftArrowIcon />
            <span>TMed Home Page</span>
        </RouterLink>
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="form-container">
                <form>
                    <div class="logo d-flex justify-content-center">
                        <img :src="logoImgURL" alt="TMedTech" />
                        <span>Portal</span>
                    </div>
                    <h2>Reset your password</h2>
                    <p>Your new password must be different from previous used passwords.</p>
                    <div class="mb-3">
                        <div class="input-group">
                            <input
                                type="password"
                                class="form-control"
                                id="new-password"
                                placeholder="Please enter your new password"
                            />
                            <div class="input-group-text">
                                <LockIcon />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                            <input
                                type="password"
                                class="form-control"
                                id="repeat-password"
                                placeholder="Confirm new password"
                            />
                            <div class="input-group-text">
                                <LockIcon />
                            </div>
                        </div>
                    </div>
                    <div class="container-fluid password-weakness-bar">
                        <div class="level-container row">
                            <div class="level danger-level"></div>
                            <div class="level weak-level"></div>
                            <div class="level good-level"></div>
                        </div>
                    </div>
                    <p>Strong</p>
                    <div class="password-rule-hints">
                        <p>Password must have:</p>
                        <div class="password-rule-hint">
                            <CheckCircleIcon />
                            <span>At least 6 character</span>
                        </div>
                        <div class="password-rule-hint">
                            <CheckCircleIcon />
                            <span>At least one number</span>
                        </div>
                        <div class="password-rule-hint">
                            <CheckCircleIcon />
                            <span>At least one uppercase letter</span>
                        </div>
                        <div class="password-rule-hint">
                            <CrossCircleIcon />
                            <span>At least one special character</span>
                        </div>
                    </div>
                    <button type="submit" class="reset-btn btn btn-primary w-100">
                        Set New Password
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "@/main.scss";
.reset-password-page {
    width: 100vw;
    height: 100vh;
    position: relative;

    * {
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 14px;
        color: #0e1123;
        line-height: normal;
    }

    & .go-home-btn {
        display: inline-block;
        text-decoration: none;
        padding: 15px 30px 15px 15px;
        height: 48px;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.5);

        position: absolute;
        top: 0;
        left: 0;
        margin-top: 65px;
        margin-left: 117px;

        & span {
            margin-left: 23px;
            color: white;
        }
    }

    & .form-container {
        display: inline-block;
        padding: 7px;
        background: rgba(218, 218, 218, 0.2);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(1.5px);
        border-radius: 10px;

        form {
            background: white;
            max-width: 415px;
            border-radius: 10px;
            padding: 80px 45px 57px 45px;

            & .logo {
                max-height: 44px;
                color: #0e1123;
                margin-bottom: 25px;

                > span,
                img {
                    vertical-align: baseline;
                    height: 44px;
                }

                > span {
                    font-style: normal;
                    font-weight: 400;
                    font-family: 'Poppins';
                    font-size: 42px;
                    margin-top: -8px;
                    margin-left: -9px;
                }
            }

            & h2 {
                font-weight: 700;
            }

            & .input-group {
                input,
                .input-group-text {
                    border: 1px solid #379a5c;
                    border-radius: 5px;
                }

                & > input {
                    border-right: none;
                    padding: 13px 17px;
                }

                & .input-group-text {
                    background: white;
                    padding-right: 10px;
                }
            }

            & .password-weakness-bar {
                margin-bottom: 8px;

                & + p {
                    margin-bottom: 8px;
                    text-align: right;
                    color: #0e1123;
                    font-size: 11px;
                    font-weight: 500;
                }
                & .level-container {
                    justify-content: space-between;
                    & .level {
                        height: 3px;
                        width: calc(100% / 3 - 4px);
                        border-radius: 9999px;

                        &:first-child {
                            margin-left: 0;
                        }

                        &:last-child {
                            margin-right: 0;
                        }

                        &.danger-level {
                            background-color: #be0b00b5;
                        }

                        &.weak-level {
                            background-color: #e7b503;
                        }

                        &.good-level {
                            background-color: #3fb86c;
                        }
                    }
                }
            }

            & .password-rule-hints {
                margin-bottom: 33px;

                * {
                    font-size: 11px;
                    font-weight: 500;
                    color: #727171;
                }

                & p {
                    margin-bottom: 10px;
                }

                & .password-rule-hint {
                    margin: 0 0 2px 0;
                    vertical-align: middle;

                    &:last-child {
                        margin-bottom: 0;
                    }

                    & span {
                        margin-left: 5px;
                    }
                }
            }

            & .reset-btn {
                border-radius: 5px;
                background: #379a5c;
                color: white;
                border: none;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;
                text-wrap: nowrap;
                padding: 12px 96px;
            }
        }
    }

    @include media-breakpoint-down(md) {
        .go-home-btn {
            margin-top: 20px;
            margin-left: 10px;
        }
    }
}
</style>

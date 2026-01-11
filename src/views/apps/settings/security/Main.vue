<template>
    <div class="main">
        <div class="pb-5">
            <div class="row pb-md-5 pt-2 pt-md-3 pt-lg-4">
                <div class="col-12 col-md-8 col-lg-6 mx-auto">
                    <div class="card p-1 pt-2 pb-2">
                        <div v-if="!pinCorrect">
                            <div class="mt-2">
                                <h3 class="border-bottom pb-1">
                                    Reset Login Password
                                </h3>
                                <p class="border-left-primary border-left-3 pl-2 pt-1">
                                   The login password is used to access your account. Keep it safe and do not share it with anyone!
                                </p>
                            </div>
                            <div class="mt-2">
                                <b-form @submit.prevent>
                                    <b-form-group label="Enter Old Password">
                                        <b-input-group>
                                            <template #prepend>
                                                <b-input-group-text> <feather-icon class="font-font-weight-bolder" icon="LockIcon" /></b-input-group-text>
                                            </template>
                                            <b-form-input autocomplete="true" type="password" v-model="oldPassword" :state="oldStatus && oldPassword.length" @blur="checkOld()" />
                                        </b-input-group>
                                        <small class="text-danger" v-if="!oldStatus && oldStatus != null">
                                            Required
                                        </small>
                                    </b-form-group>
                                    <b-form-group label="Enter New Password">
                                        <b-input-group>
                                            <template #prepend>
                                                <b-input-group-text> <feather-icon class="font-font-weight-bolder" icon="LockIcon" /></b-input-group-text>
                                            </template>
                                            <b-form-input autocomplete="true" type="password" v-model="newPassword" :state="newStatus" @blur="checkNew()" />
                                        </b-input-group>
                                        <small class="text-danger" v-if="!newStatus && newStatus != null">
                                            Password must not be less than 8 characters and should contain at least 1 of the following: uppercase, lowercase, number and special character (!@#$%^&*)
                                        </small>
                                    </b-form-group>
                                    <b-form-group label="Confirm Password" class="mt-2">
                                        <b-input-group>
                                            <template #prepend>
                                                <b-input-group-text> <feather-icon class="font-font-weight-bolder" icon="LockIcon" /></b-input-group-text>
                                            </template>
                                            <b-form-input autocomplete="true" type="password" v-model="confirmPassword" :state="checkConfirm()" @blur="checkConfirm()" />
                                        </b-input-group>
                                        <small class="text-danger" v-if="confirmPassword != newPassword && confirmStatus != null">
                                            Passwords Do Not Match
                                        </small>
                                    </b-form-group>
                                </b-form>
                                <div class="text-center pt-2">
                                    <b-overlay class="d-inline-block" :show="updating">
                                        <b-button @click="changePsw" :disabled="!canSubmit()" variant="primary"> <feather-icon icon="CheckIcon" /> 
                                            Confirm
                                        </b-button>
                                    </b-overlay>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>
<script>

import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import Utils from '@/utils/index';
import { 
    BInputGroup, 
    BButton,
    BInputGroupText,
    BFormGroup,
    BForm,
    BFormInput,
    BOverlay
    } from 'bootstrap-vue';
import {resetPassword} from '../api'



export default {
    name: 'Main',
    components:{
        //PincodeInput,
        BOverlay,
        BInputGroup,
        BInputGroupText,
        BFormGroup,
        BFormInput,
        BForm,
        BButton,
        vSelect,
        flatPickr
    },
    data() {
        return{
            confirmStatus: null,
            newStatus: null,
            oldStatus: null,
            updating: false,
            wrongPin: '',
            oldPassword: '',
            confirmPassword: '',
            newPassword: '',
            pinCorrect: false,
            firstConfirm: false,
            pin: '',
            newPin: '',
            confirmPin: '',
        }
    },
    mounted() {
        
    },
    methods: {
        checkOld() {
            if(!this.oldPassword.length) {
                this.oldStatus = false;
                return false;
            }
            this.oldStatus = null;
            return null;
        },
        checkNew() {
            if(!this.newPassword.length) {
                this.newStatus = null;
                return null;
            }
            
            if(!this.checkPassword(this.newPassword)) {
                this.newStatus = false;
                return false;
            }
    
            this.newStatus = true;
            return true;
            
        },
        checkConfirm() {
            if(!this.confirmPassword.length) {
                this.confirmStatus = null;
                return null;
            }
            if(this.newPassword != this.confirmPassword) {
                this.confirmStatus = false;
                return false;
            }
            this.confirmStatus = true;
            return true;
            
        },
        hidePin() {
            this.pinCorrect = false;
        },
        checkPassword(str) {
            var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            return re.test(str);
        },
        canSubmit() {
            if((this.checkPassword(this.newPassword) && this.newPassword == this.confirmPassword && !!this.oldPassword)) {
                return true;
            }
            return false;
        },
        changePsw() {
            if(!this.canSubmit()) {
                return false;
            }
            this.updating = true;
            resetPassword({newPassword: this.newPassword, oldPassword: this.oldPassword}).then(res=>{
                this.updating = false;
                if(res.success) {
                    this.showToast('Password Changed','success', 'Success');
                    this.oldPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                    this.oldStatus = null;
                    this.newStatus = null;
                    this.confirmStatus =  null;
                }else{
                    this.showToast('Password Not Changed')
                }
            }).catch(error=>{
                this.updating = false;
                this.showToast('Password Not Changed');
            });
        },
        showToast(message,  variant = 'danger', title = null) {
            this.$bvToast.toast(`${message}`, {
            title: title || 'ERROR',
            autoHideDelay: 5000,
            appendToast: true,
            solid: true,
            variant: variant
            })
        },
    }
}
</script>
<style lang="scss" scope="">
    @import '@core/scss/vue/libs/vue-select.scss';
    @import '@core/scss/vue/libs/vue-flatpicker.scss';

    input.vue-pincode-input {
        margin-left: 5px;
        margin-right: 5px;
    }
    .height-fill{
        height: 80%;
        min-height: 80%;
    }
    .color-light{
        color: #fff !important;
    }
    .txn-logos{
        margin-bottom: 3px;
        width: 40px;
        border-radius: 2px;
    }
</style>
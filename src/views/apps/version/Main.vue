<template>
    <div>
        <div class="p-1">
            <div class="row">
                <div class="col-12 col-md-6 ">
                    <b-form-group label="App Version">
                    <v-select  v-model="minVer"  :options="versions"  ref="minVer"></v-select>
                </b-form-group>
                </div>
            </div>
            <b-form-group>
                <div>
                    <b-form-checkbox v-model="soft" name="check-button" switch>
                        Soft Update
                    </b-form-checkbox>
                </div>
            </b-form-group>
            <b-form-group>
                <div>
                    <b-form-checkbox v-model="force" name="check-button" switch>
                        Force Update
                    </b-form-checkbox>
                </div>
            </b-form-group>
            <div class="">
                <b-button variant="primary" @click="setVersion()">
                    Submit <feather-icon icon="PlayIcon"></feather-icon>
                </b-button>
            </div>
            <div class="pt-2">
                <div>
                    Current Version: <span class="text-primary">{{ currentVersion.minVer }}</span>
                </div>
                <div>
                    Soft Update: <span class="text-primary">{{ currentVersion.soft }}</span>
                </div>
                <div>
                    Force Update: <span class="text-primary">{{ currentVersion.force }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import vSelect from 'vue-select'
import Api from './api'

export default {
    name: 'Main',
    components: {
        vSelect
    },
    data() {
        return {
            versions: [
                "1.0.0",
                "1.1.0",
                "1.5.0",
                "2.0.0",
                "2.1.0",
                "3.0.0",
                "3.5.0",
                "4.0.0",
                "4.5.0",
                "5.0.0",
            ],
            soft: true,
            force: false,
            minVer: '',
            currentVersion: {
                minVer: '',
                soft: null,
                force: null
            }
        }
    },
    watch: {
        soft: function(data) {
            this.force = !data
        },
        force: function(data) {
            this.soft = !data
        }
    },
    mounted() {
        this.getVersion();
    },
    methods: {
        setVersion() {
            if(this.minVer.trim().length == 0) {
                this.showToast('Select App version');
                return 0;
            }
            const config = {
                minVer: this.minVer,
                soft: this.soft,
                force: this.force,
            }
            Api.setConfig({...config}).then(res=>{
                if(res.success && res.data) {
                    const { force, soft, minVer } = res.data;
                    this.currentVersion = { force, soft, minVer };
                    this.showToast('Minimum version set successfully', 'CheckCircleIcon', 'success');
                    this.minVer = '';
                }
            }).catch(err=>{
                this.showToast('Failed to set minimum version');
                console.log(err);
            })
        },
        getVersion() {
            Api.getConfig().then(res=>{
                if(res.success && res.data) {
                    const { force, soft, minVer } = res.data;
                    this.currentVersion = { force, soft, minVer };
                }
            }).catch(err=>{
                this.showToast('Failed to get minimum version');
                console.log(err);
            })
        },
         showToast(message, icon, variant) {
            this.$toast({
                component: ToastificationContent,
                props: {
                    title: message || 'Error fetching feedbacks',
                    icon: icon || 'InfoIcon',
                    variant: variant || 'danger',
                },
            })
        },
    }
}
</script>
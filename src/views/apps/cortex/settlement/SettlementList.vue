<template>
    <div>
        <b-card>
            <b-card-text v-show="isTableViewActive">
                <b-table
                    id="txnList"
                    striped
                    responsive
                    :fields="selectedColumns"
                    :items="txnDataList"
                    :per-page="perPage"
                    :current-page="currentPage"
                    show-empty
                    hover
                    @row-clicked="showDetails"
                >
                    <!-- Show table busy when loading -->
                    <template #table-busy>
                        <div class="text-center text-danger my-2">
                            <b-spinner class="align-middle mr-1"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                    </template>
                    <!-- Custom header formatting -->
                    <template #head()="scope">
                        <div class="text-nowrap text-primary">
                            {{ scope.label }}
                        </div>
                    </template>

                    <!-- Beginning of important cells -->
                    <!-- Entry ID -->
                    <template #cell(_id)="data">
                        <div v-if="data.value" style="font-size: 12px">
                            {{ data.value }}
                        </div>
                    </template>

                    <!-- Entry Payer -->
                    <template #cell(payerOrgUser)="data">
                        <div v-if="data.item.payerOrgUser">
                            <div class="d-flex align-items-center">
                                <span style="position: relative;" class="mr-1">
                                    <b-avatar
                                        :variant="typeof parseInt(avatarUrlFormatter(data.item.payerOrgUser.displayName, data.item.payerOrgUser.avatarUrl)) === 'number' && !data.item.payerOrgUser.avatarUrl ? 'light-primary' : 'light'"
                                        :text="data.item.payerOrgUser.avatarUrl ? '' : avatarUrlFormatter(data.item.payerOrgUser.displayName, data.item.payerOrgUser.avatarUrl)"
                                        :src="data.item.payerOrgUser.avatarUrl ? avatarUrlFormatter(data.item.payerOrgUser.displayName, data.item.payerOrgUser.avatarUrl) : ''"
                                    />
                                    <span v-if="data.item.payerOrgUser.isVerified || data.item.payerOrgUser.isVerified == 'true' || data.item.payerOrgUser.isVerified == '1'" style="position: absolute; bottom: -2px; right: 0; border-radius: 50%;">
                                        <feather-icon size="12" style="color: #004085" icon="CheckCircleIcon" />
                                    </span>
                                </span>
                                <div class="d-flex flex-column justify-content-center">
                                    <span>
                                        {{ data.item.payerOrgUser.displayName }}
                                    </span>
                                    <div style="font-size: 11px; font-style: italic; ">
                                        #{{ data.item.payerOrgUser._id }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Entry Beneficiary -->
                    <template #cell(beneUser)="data">
                        <div v-if="data.item.beneUser">
                            <div class="d-flex align-items-center">
                                <span style="position: relative;" class="mr-1">
                                    <b-avatar
                                        :variant="typeof parseInt(avatarUrlFormatter(data.item.beneUser.beneName, data.item.beneUser.avatarUrl)) === 'number' && !data.item.beneUser.avatarUrl ? 'light-primary' : 'light'"
                                        :text="data.item.beneUser.avatarUrl ? '' : avatarUrlFormatter(data.item.beneUser.beneName, data.item.beneUser.avatarUrl)"
                                        :src="data.item.beneUser.avatarUrl ? avatarUrlFormatter(data.item.beneUser.beneName, data.item.beneUser.avatarUrl) : ''"
                                    />
                                    <span v-if="data.item.beneUser.isVerified || data.item.beneUser.isVerified == 'true' || data.item.beneUser.isVerified == '1'" style="position: absolute; bottom: -2px; right: 0; border-radius: 50%;">
                                        <feather-icon size="12" style="color: #004085" icon="CheckCircleIcon" />
                                    </span>
                                </span>
                                <div class="d-flex flex-column justify-content-center">
                                    <span>
                                        {{ data.item.beneUser.beneName }}
                                    </span>
                                    <div style="font-size: 11px; font-style: italic; ">
                                        #{{ data.item.beneUser._id }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Entry Description -->
                    <template #cell(description)="data">
                        <div v-if="data.value">
                            {{ data.value }}
                        </div>
                    </template>

                    <!-- Entry Amount -->
                    <template #cell(amount)="data">
                        <div v-if="data.value">
                            {{ data.value + " " + data.item.currencyCode }}
                        </div>
                    </template>

                    <!-- Entry Status -->
                    <template #cell(statusText)="data">
                        <div v-if="data.value">
                            <b-badge v-if="data.value == 'pending'" variant="light-warning">
                                {{ data.value }}
                            </b-badge>
                            <b-badge v-else variant="light-success">
                                {{ data.value }}
                            </b-badge>
                        </div>
                    </template>

                    <!-- Entry Type -->
                    <template #cell(typeText)="data">
                        <div v-if="data.value">
                            {{ data.value }}
                        </div>
                    </template>
                </b-table>
            </b-card-text>
        </b-card>
    </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import API from "../api"

export default defineComponent({
    setup() {
        const settlementList = ref([]);

    },
})
</script>

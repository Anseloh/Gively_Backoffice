<template>
<div>
    <b-card>
        <b-card-text>
            <div class="d-flex justify-content-between">
                <div>
                    <b-nav fill>
                        <b-nav-item :active="true">
                            List
                        </b-nav-item>
                        <b-nav-item>
                            Sales
                        </b-nav-item>
                        <b-nav-item></b-nav-item>
                    </b-nav>
                </div>
                <div>
                    <b-button-group>
                        <b-button
                            :variant="isListViewActive ? 'primary' : 'flat-primary'" @click="onListView"
                        >
                            <feather-icon size="18" icon="ListIcon"></feather-icon>
                        </b-button>
                        <b-button
                            :variant="isTableViewActive ? 'primary' : 'flat-primary'" @click="onTableView">
                            <feather-icon size="18" icon="GridIcon"></feather-icon>  
                        </b-button>
                    </b-button-group>
                </div>
            </div>
            <div>
                <h4>Available Columns</h4>
                <b-row>
                    <b-col cols="6" v-for="(item, index) in listFields" :key="index">
                        <b-form-checkbox
                            v-model="selectedColumns"
                            :value="item"
                            size="md"
                            class="mb-1"
                        >
                        {{ item.label }}
                        </b-form-checkbox>
                    </b-col>
                </b-row>
            </div>
        </b-card-text>
    </b-card>
    <b-card>
        <b-card-text v-show="isListViewActive">
            <json-view :data="formattedTxnData" />
        </b-card-text>
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
    <b-sidebar
      v-model="showSidebar"
      shadow
      bg-variant="white"
      backdrop
      right
      title="Details"
    >
        <json-view :data="detailedData" rootKey="view" />
    </b-sidebar>
</div>
  
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
} from "@vue/composition-api";
import API from "../api";

export default defineComponent({
  setup() {
    const txnDataList = ref([]);
    const formattedTxnData = ref({});
    const isListViewActive = ref(false);
    const isTableViewActive = ref(true);
    const showSidebar = ref(false);
    const detailedData = ref({});
    const listFields = ref([
        { key: "_id", label: "Entry ID" },
        { key: "payerOrgUser", label: "Payer" },
        { key: "beneUser", label: "Beneficiary" },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
        { key: "statusText", label: "Status" },
        { key: "typeText", label: "Type" }
    ]);
    const selectedColumns = ref([
        { key: "_id", label: "Entry ID" },
        { key: "payerOrgUser", label: "Payer" },
        { key: "beneUser", label: "Beneficiary" },
        { key: "description", label: "Description" },
        { key: "amount", label: "Amount" },
        { key: "statusText", label: "Status" },
        { key: "typeText", label: "Type" }
    ])
    const perPage = ref(10);
    const currentPage = ref(1);

    // Implementing a recursive function
    const capitalizeText = params => {
        // Format camel-case to standard phrase
        let phrasedKey = params.split(/(?=[A-Z])/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(" ");
        return phrasedKey;
    }

    const formatObjectKey = params => {
        let result = {};
        Object.keys(params).forEach(key => {
            const elem =  params[key];
           
            if( elem !== null && elem !== undefined && typeof elem === 'object' && !Array.isArray(elem)) {
                // For objects only
                result[capitalizeText(key)] = formatObjectKey(elem);
            } else if (elem !== null && elem !== undefined && Array.isArray(elem)) {
                let tempArray = [];
                for (let x = 0; x < elem.length; x++) {
                    const item = elem[x];
                    tempArray.push(formatObjectKey(item))
                    // We can add another internal check here of Array[{Object: {Object}}] and so on and so forth
                }
                    // console.log(tempArray)
                result[capitalizeText(key)] = tempArray;
            } else {
                 result[capitalizeText(key)] = elem;
            }

            // delete params[key];
        });

        // console.log("params====",params);
        return result;
    }

    const onListView = () => {
        isListViewActive.value = true;
        isTableViewActive.value = false;
    }
    const onTableView = () => {
        isListViewActive.value = false;
        isTableViewActive.value = true;
    }

    const showDetails = item => {
        showSidebar.value = true;
        detailedData.value = formatObjectKey(item);
    }

    const avatarUrlFormatter = (displayName, avatarUrl) => {
        if (avatarUrl) {
            return avatarUrl;
        }

        let newAvatarUrl = displayName.slice(0, 2)

        if (newAvatarUrl == "+2") {
            newAvatarUrl = displayName.slice(11)
            // console.log(avatarUrl)
        }
        return newAvatarUrl
    }

    const loadTxnData = async () => {
        const { data, success } = await API.transactionList();

        if (success) {
            // console.log("Raw List------------->", data.list)
            txnDataList.value = data.list;
            formattedTxnData.value = formatObjectKey(data);

            // console.log("Raw List------------->", txnDataList.value)
        }
    };
    const dummyData = ref({
        data: {
            currentPage: 1,
            hasMore: true,
            list: [
            {
                id: "11",
                _id: "MP22032949CAJB4O6FGE",
                currencyCode: "XAF",
                amount: 4000,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "1",
                serviceTypeText: "payment",
                description: "Payment to +237671922163",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 4000,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 4000,
                _id: "f566a9fb6c8a4784bbdb4dc2365a8661",
                displayName: "+237671922160",
                isVerified: null,
                avatarUrl: null,
                },
                payerAccount: {
                _id: "ACMYKT68J8XL2YPPTZ4P",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 4000,
                fee: 0,
                netAmount: 4000,
                _id: "b9fd67fe452b41c29c01ed993a9d53e8",
                beneName: "+237671922163",
                isVerified: null,
                avatarUrl:
                    "http://fms.tranzak.me/cdn/img/xbs0htr70ni18m8d_fpq0lbb0qqy6z8100734.8230166994.jpg",
                },
                beneAccount: {
                _id: "MSAUX49AAO4V27W2TTHZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn-black.png",
                name: "Merchant account (Default)",
                description: "",
                type: "5",
                typeText: "Merchant account (Default)",
                },
                service: {
                type: "1",
                typeText: "payment",
                },
            },
            {
                id: "10",
                _id: "PP220328DQ4E1CFGJ3MW",
                currencyCode: "XAF",
                amount: 1300,
                status: "10",
                statusText: "pending",
                type: "1",
                typeText: "transfer",
                serviceType: "23",
                serviceTypeText: "payout",
                description: "Mass payment",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 1300,
                fee: 1,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 1301,
                _id: "f566a9fb6c8a4784bbdb4dc2365a8661",
                displayName: "+237671922160",
                isVerified: null,
                avatarUrl: null,
                },
                payerAccount: {
                _id: "ACMYKT68J8XL2YPPTZ4P",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 1300,
                fee: 0,
                netAmount: 1300,
                _id: "f566a9fb6c8a4784bbdb4dc2365a8661",
                beneName: "+237671922160",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACYKRSTCHM519PJ2F1BT",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Transient account",
                description: "",
                type: "14",
                typeText: "Transient account",
                },
                service: {
                type: "23",
                typeText: "payout",
                },
            },
            {
                id: "9",
                _id: "MP2203283L5EY8BSQXHB",
                currencyCode: "XAF",
                amount: 10000,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "1",
                serviceTypeText: "payment",
                description: "Payment to +237671922163",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 10000,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 10000,
                _id: "f566a9fb6c8a4784bbdb4dc2365a8661",
                displayName: "+237671922160",
                isVerified: null,
                avatarUrl: null,
                },
                payerAccount: {
                _id: "ACMYKT68J8XL2YPPTZ4P",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 10000,
                fee: 0,
                netAmount: 10000,
                _id: "b9fd67fe452b41c29c01ed993a9d53e8",
                beneName: "+237671922163",
                isVerified: null,
                avatarUrl:
                    "http://fms.tranzak.me/cdn/img/xbs0htr70ni18m8d_fpq0lbb0qqy6z8100734.8230166994.jpg",
                },
                beneAccount: {
                _id: "MSAUX49AAO4V27W2TTHZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn-black.png",
                name: "Merchant account (Default)",
                description: "",
                type: "5",
                typeText: "Merchant account (Default)",
                },
                service: {
                type: "1",
                typeText: "payment",
                },
            },
            {
                id: "8",
                _id: "PP220328ILK33KG7ZAJB",
                currencyCode: "XAF",
                amount: 40000,
                status: "10",
                statusText: "pending",
                type: "8",
                typeText: "cash-out",
                serviceType: "1",
                serviceTypeText: "payment",
                description: "Hello",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 40000,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 40000,
                _id: "f566a9fb6c8a4784bbdb4dc2365a8661",
                displayName: "+237671922160",
                isVerified: null,
                avatarUrl: null,
                },
                payerAccount: {
                _id: "ACMYKT68J8XL2YPPTZ4P",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 40000,
                fee: 0,
                netAmount: 40000,
                _id: "sysygc9ftc7pth0w",
                beneName: "MTN Momo|+237678383838",
                isVerified: "0",
                avatarUrl: "/static/img/partners/mtn.png",
                displayName: "",
                },
                beneAccount: {
                _id: "ACZO4BYZVXPDKIYER3UG",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "MTN Momo | 237678383838",
                description: "",
                type: "3",
                typeText: "Payment service provider account",
                },
                service: {
                type: "1",
                typeText: "payment",
                },
            },
            {
                id: "7",
                _id: "PP220328ANAWMQI873TR",
                currencyCode: "XAF",
                amount: 400,
                status: "21",
                statusText: "processing by partner",
                type: "1",
                typeText: "transfer",
                serviceType: "22",
                serviceTypeText: "treasury_inbound",
                description: "",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 400,
                _id: "sysrqbmwgak4egvw",
                displayName: "Tranzak System Account | Cameroon",
                isVerified: "0",
                avatarUrl: null,
                },
                payerAccount: {
                _id: "ACJPX7MCS71PSGDWC9H3",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "CSA account",
                description: "",
                type: "2",
                typeText: "CSA account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                netAmount: 400,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                beneName: "MTN Momo|",
                isVerified: null,
                avatarUrl: "null",
                displayName: "",
                },
                beneAccount: {
                _id: "PMNSWASWQDFT18MEDDCV",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "MTN Momo | 237651414645",
                description: "App User",
                type: "7",
                typeText: "Payment method",
                },
                service: {
                type: "22",
                typeText: "treasury_inbound",
                },
            },
            {
                id: "6",
                _id: "PP220328A7EMTPZGE8I6",
                currencyCode: "XAF",
                amount: 400,
                status: "30",
                statusText: "successful",
                type: "7",
                typeText: "balance top-up",
                serviceType: "1",
                serviceTypeText: "payment",
                description: "Payment to +237622922163",
                completedAt: "2022-03-28 13:52:05.161475",
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 400,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                displayName: "+237651414645",
                isVerified: null,
                avatarUrl: "null",
                },
                payerAccount: {
                _id: "PMNSWASWQDFT18MEDDCV",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "MTN Momo",
                description: "App User",
                type: "7",
                typeText: "Payment method",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                netAmount: 400,
                _id: "dadb46c4d7a04a4ebf8717eecfdba825",
                beneName: "+237622922163",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACPIIC7IEBOJ69K5Y7N6",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                service: {
                type: "1",
                typeText: "payment",
                },
            },
            {
                id: "5",
                _id: "PP220328H1T4DRFJC5HK",
                currencyCode: "XAF",
                amount: 400,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "24",
                serviceTypeText: "payment",
                description: "Merchant Payment",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 400,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                displayName: "+237651414645",
                isVerified: null,
                avatarUrl: "null",
                },
                payerAccount: {
                _id: "ACVXCJW11B1A5LC92ONZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 400,
                fee: 0,
                netAmount: 400,
                _id: "dadb46c4d7a04a4ebf8717eecfdba825",
                beneName: "+237622922163",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACPIIC7IEBOJ69K5Y7N6",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                service: {
                type: "24",
                typeText: "payment",
                },
            },
            {
                id: "4",
                _id: "PP220328KM23OXIBU7VP",
                currencyCode: "XAF",
                amount: 700,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "24",
                serviceTypeText: "payment",
                description: "Merchant Payment",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 700,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 700,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                displayName: "+237651414645",
                isVerified: null,
                avatarUrl: "null",
                },
                payerAccount: {
                _id: "ACVXCJW11B1A5LC92ONZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 700,
                fee: 0,
                netAmount: 700,
                _id: "dadb46c4d7a04a4ebf8717eecfdba825",
                beneName: "+237622922163",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACPIIC7IEBOJ69K5Y7N6",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                service: {
                type: "24",
                typeText: "payment",
                },
            },
            {
                id: "3",
                _id: "PP220328DBVZ1ERYE869",
                currencyCode: "XAF",
                amount: 700,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "24",
                serviceTypeText: "payment",
                description: "Merchant Payment",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 700,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 700,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                displayName: "+237651414645",
                isVerified: null,
                avatarUrl: "null",
                },
                payerAccount: {
                _id: "ACVXCJW11B1A5LC92ONZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 700,
                fee: 0,
                netAmount: 700,
                _id: "dadb46c4d7a04a4ebf8717eecfdba825",
                beneName: "+237622922163",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACPIIC7IEBOJ69K5Y7N6",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                service: {
                type: "24",
                typeText: "payment",
                },
            },
            {
                id: "2",
                _id: "PP220328XT3X40KBCX38",
                currencyCode: "XAF",
                amount: 300,
                status: "10",
                statusText: "pending",
                type: "3",
                typeText: "merchant payment",
                serviceType: "24",
                serviceTypeText: "payment",
                description: "Merchant Payment",
                completedAt: null,
                isInitiatedByPayer: "1",
                couponAmount: 0,
                tipAmount: 0,
                payerOrgUser: {
                merchantDiscountAmount: 0,
                currencyCode: "XAF",
                amount: 300,
                fee: 0,
                bonusAmount: 0,
                giftCardAmount: 0,
                netAmount: 300,
                _id: "845f5c7c0a7249c69e689054e1634b15",
                displayName: "+237651414645",
                isVerified: null,
                avatarUrl: "null",
                },
                payerAccount: {
                _id: "ACVXCJW11B1A5LC92ONZ",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                beneUser: {
                currencyCode: "XAF",
                amount: 300,
                fee: 0,
                netAmount: 300,
                _id: "dadb46c4d7a04a4ebf8717eecfdba825",
                beneName: "+237622922163",
                isVerified: null,
                avatarUrl: null,
                },
                beneAccount: {
                _id: "ACPIIC7IEBOJ69K5Y7N6",
                currencyCode: "XAF",
                avatarUrl:
                    "https://staging-api.tranzak.me/fapi/static/img/logos/tz-logo-btn.png",
                name: "Primary account",
                description: "",
                type: "1",
                typeText: "Primary account",
                },
                service: {
                type: "24",
                typeText: "payment",
                },
            },
            ],
            pageCount: [1, 50],
            pageSize: 10,
            totalItems: 11,
        },
        success: true,
        debugInfo: null,
        debug: {
            lang: "en-US",
            dateTime: "2022-03-29T08:25:05+00:00",
            hostname: "staging-1",
            serverIpAddress: "172.31.42.225",
            clientIpAddress: "154.72.170.155",
            duration: "0.016s",
            userId: "1",
            staffId: "1",
            staffFirstName: null,
        },
    });

    const cleanDummy = ref({});

    const formatReadableData = params => {
        cleanDummy.value = formatObjectKey(dummyData.value.data);
    }
    onMounted(() => { 
        // formatReadableData()    
        loadTxnData();
    });

    return {
      txnDataList,
      formattedTxnData,
      isListViewActive,
      isTableViewActive,
      avatarUrlFormatter,
      listFields,
      perPage,
      currentPage,
      onListView,
      onTableView,
      dummyData,
      cleanDummy,
      showDetails,
      showSidebar,
      detailedData,
      selectedColumns
    };
  },
});
</script>
<style scoped>
.nav-link .active {
    color: red
}
</style>
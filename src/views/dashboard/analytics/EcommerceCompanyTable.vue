<template>
    <b-card class="card-company-table">
        <h4>Recent Backings</h4>

        <b-table
            :empty-text="'No Transactions To Show'"
            :per-page="5"
            responsive
            :items="tableData"
            :fields="fields"
        >
            <!-- Custom style for headings with their translation implementation -->
            <!-- <template #head()="scope">
             <div class="text-nowrap text-primary">
                   Transaction No
                </div>
            </template> -->
            <!-- Amount -->
            <template #cell(amount)="data">
                <b-link class="text-center text-nowrap">
                    {{ data.value }} USD
                </b-link>
            </template>

                 <!-- Amount -->
            <template #cell(createdAt)="data">
              {{ dayjs(data.value).format("YYYY-MM-DD H:MM") }} 
            </template>

        
            <!-- Type -->
            <template #cell(type)="data">
                <div class="text-center">
                    <feather-icon
                        size="20"
                        :class="
                            data.value == 'transfer'
                                ? 'text-success'
                                : 'text-primary'
                        "
                        :icon="
                            data.value == 'transfer'
                                ? 'Maximize2Icon'
                                : data.value == 'payment'
                                ? 'Minimize2Icon'
                                : ''
                        "
                    ></feather-icon>
                </div>
            </template>
               </b-table>
    </b-card>
</template>

<script>
import { BCard, BTable, BAvatar, BImg } from "bootstrap-vue";
import moment from "moment";
import dayjs from "dayjs";
import { useUtils as useI18nUtils } from "@core/libs/i18n";
import Utils from "@/utils/index";
import { kFormatter } from "@core/utils/filter";
import Api from "./api";

export default {
    components: {
        BCard,
        BTable,
        BAvatar,
        BImg
    },
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            dayjs:dayjs,
            fields: [
                { key: "transactionNo", label: "Transaction No"},
                { key: "amount", label: "amount"},
                { key: "createdAt", label: "Time"},
                { key: "campaignTitle", label: "Campaign Title"}
            ],
            status: [
                {
                    1: "pending",
                    2: "completed",
                    3: "failed",
                },
                {
                    1: "alert-warning",
                    2: "alert-success",
                    3: "alert-danger",
                },
            ],
            moment: moment,
        };
    },
    mounted() {
    },
    methods: {
        kFormatter,
        // Add additional empty rows to the table to fill up the page so it doesn't look empty with just 2 or 3 items
        paddTableRows(params) {
            const rowsDispenser = Math.max(
                0,
                params * 10 - this.dataTxn.list.length
            );

            for (let index = 0; index < rowsDispenser; index++) {
                this.dataTxn.list.push({ isBlank: true });
            }
        },
    }
};
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/bootstrap-extended/include";
@import "~@core/scss/base/components/variables-dark";

.card-company-table ::v-deep td .b-avatar.badge-light-company {
    .dark-layout & {
        background: $theme-dark-body-bg !important;
    }
}
.card-company-table{
    overflow: hidden;
}
.height-fill {
    height: 80%;
    min-height: 80%;
}
.color-light {
    color: #fff !important;
}
.txn-logos {
    margin-bottom: 3px;
    width: 40px;
    border-radius: 2px;
}
</style>

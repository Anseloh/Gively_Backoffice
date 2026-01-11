<template>
    <b-card v-if="data" no-body class="card-revenue-budget">
        <b-row class="mx-0">
            <b-col md="8" class="revenue-report-wrapper">
                <div
                    class="d-sm-flex
                        justify-content-between
                        align-items-center
                        mb-1"
                        >
                  <h4 class="card-title mb-50 mb-sm-0">Backing Trend </h4>
                </div>
                <div v-if="lineChartOptions.xAxis.data && lineChartOptions.xAxis.data.length">
                  <v-chart class="area-chart" :option="lineChartOptions" />
                </div>
            </b-col>
            <b-col md="4" class="budget-wrapper">
              <div>
                <v-chart class="pie-chart" :option="pieChartDataOptions" />
              </div>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
import {
    BCard,
    BRow,
    BCol,
    BDropdown,
    BDropdownItem,
    BButton,
} from "bootstrap-vue";

import Ripple from "vue-ripple-directive";
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { kFormatter } from "@core/utils/filter";
import Utils from "@/utils/index"

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from "echarts/components";
import VChart from "vue-echarts";

import { graphic } from 'echarts'

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
]);

export default {
    components: {
        BDropdown,
        BDropdownItem,
        BCard,
        BButton,
        BRow,
        BCol,
        VChart
    },
    directives: {
        Ripple,
    },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
          totalAmount: 0,
          pieChartDataOptions: {
                title: {
                    text: 'Users Insight',
                    subtext: 'Email verification',
                    left: 'center'
                },
                color:['#990099',"#24a5ff",'#dd710d', "#59bef9", "#3d83f7", '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#c23531'],
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'horizontal',
                    bottom: '5%'
                },
                series: [
                    {
                    name: 'Access From',
                    type: 'pie',
                    radius: '75%',
                     label: {
                        show: false
                     },
                    data: [
                        { value: 0, name: 'Activated' },
                        { value: 1, name: 'Non-activated' },
                    ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
          ]},
          lineChartOptions: {
            color: ["#109495", "#2D16C8", "#80FF80", "#FF8096", "#800080"],
            title: {
              text: "",
              left: "0%",
              textStyle: {
                color: "#000",
                fontSize: 15
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#023c61'
                }
              }
            },
            legend: {
              data: [
                {
                  name: "Backing"
                  // icon:
                  //   "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAgxJREFUeNp8VD1rVEEUvXfeBlHYn7DplP0FYbHZsIsWabYJsREhBiTWgiA2FhbiH7AViU1Is0Uag2IQZdk2YCJiY8Q+RAvNvrmeO/Nm3szj4S537rz5OPfcr2Fq+dnt4YiK8haZEtouU7EgKuS7FOU7Kexu5+nR2+YdzgC2bvYB8ILMYhWanBjrdWFJMLdLJQHwfblk719+fHIS7poIsrk2JKE5ZDW3JYn2IowzwvPfz64NMyB7Z9KHmoJfN+MoKWdMmKsFxl+62J/+en6173bt7XUmc/EJ7gyouCAXD1N66XiXsKcxgktwrbMg67QXuDvD+nVlNIYMvGUMwnn0pKIVPWSKZ53iAYaxAm3ECyrpIYfBfsIBNPgrzkG/RhsKNIoMAguW9kBxM9HiDGEcKVCvMuBpS5KoNGlhwhJYUM1Pegr0x5/h5FbCgJslx1VovOHgpAL9rGkm1qWt5msDoiD15w8Fmuc1XsWEkywF1KQ2NTISs0ofFeh1fSgANBlxozi9O6E0MO4o0BvIrHaJ6f8tQtFYVegzqANjdvZ0dxMrZ3l2WkIkod5i4M/webf74Ju4XjOvptrFE2yctyNUaYrRdcbOATzpPvx6nHW/ebl/CLWiVNuZSRp0PbNy5dGXw9b3yL0E98YoisUNvEHraNwxGreHN+kvmvcU79AH6ZR7ZWEPLj35nKXjnwADAEoc2SYA+B3cAAAAAElFTkSuQmCC"
                }
              //   {
              //     name: "Users"
              //     // icon:
              //     //   "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdBJREFUeNqMVDtPAkEQniEnTw2/AGv+gMTEQnLExoZCxUcMidpofz+D3sJEEoOPEBpaiQ9iNAR/gNZq7A2VZmGcXTjYXQ5xwjB3t/N9++3O7CIE2ElRuCIBm+xuLwbzvTAAReGN4y1EoOodOjc2BvWXs1WRFnE47sYhK2YBOEI3BtCL9J2YkIkAZuCe/cgrOq8+NuQ/VFyxzKENBFn1gfiH/WhMSyrKnHbpUmFGRBdLIs05dU6aUxwDnUi2Zo0MVG69VBVpRXS1IJAHyuxJSYADAkQDBL5Ky5Ls5VJNoFSUY8CivWFEff+HSWxOEhWkAoKRG5XASaUxrCCJXB+MNAIMV2WrClKJ4EqilDEjDpZlKcK/l5eSRN/GbKSB0BJCgdUblv/THyC0wDSoIJmKtX7y7SOkmtAvub5PGrnfV0MF4/FREp3rGxtY8WltgFCRRNf80EKto/XGNJZgt0L/vcU5jdDWs0O8F3uc/6XGcXQ0aFq5iDEI+966Q+qs7TypU5xn7wwbkywBNHZcOpyQ9zacF+P07945TU7OcEIrSASZy2rxf8bbdpoTm/50TWA3ASt8qa1zzHWjkOpF4Yfvo3eKwAPfQzUIQ8M7cIwS/AowABJopTCpyT9KAAAAAElFTkSuQmCC"
              //   }
              ],
              itemWidth: 12,
              itemHeight: 12,
              // padding:0,
              show: true,
              textStyle: {
                color: "#000"
              },
              orient: "vertical",
              // icon:"image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABgCAYAAABot+55AAAACXBIWXMAAAsSAAALEgHS3X78AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnhJREFUeNrs2L9rE3EYx/HnuUsRheBfEAdByV9QuqU06ODSpegiQhVEZ0EQFwcHEZwdK1IX6ZLBxaJYRChZBa2Ii4p7iQ5K7h6fy/3M9WJxCoX3q3zzveQuufK5733vuRMBAAAAAAAAAAAAAAAAAAAAAAAAAGA2nfc/EN/orUgYXZIg8j4+JeFYJLSvFkavLYyft+6/f0W4/xvqtfNdD/WxBONl72XSgjjtw1jMl+OFSDzkN9FCfPP43b29oxZuMJdg1y/0xGTobXl6jVX6tJn6NqbDXw/O9gj3sGCvrHa9G/g50546b6x6HvmCavaB+p+1ff3g58MzXcKdFezltSStDR+JJ6dGahGsVkZvtsIs/UTFv2Mbo0enlXCb9b0tFUGaTs/8lqVczA5aCT3pdMlf+oTb7GIRYtKqwU1yzUau5kFbMZp1ErqVv0G4B6wUIzUfrWrNE6/WixmbhG/5bxDuAZ1iWjUti4J6sZAvqOWjVcpxbB3CbfY7vzqVSVZGqtbLb82m2vRg5BME4Tb7UZ7i1YrgH/c3k6lW04DTt98Jt9lw+r4wm2O1Uh1Uy7PiOGTlWDpFvCPcZs/K4PJQ6yNXazcU2VSQlWn+ukm4zV562y2ng/r8Wb/9leIAZDdsu95tE27Tzja3ksTWPaX96aqgYWPL6+Hi4rbvb6+2b30xwp21w6eD5OnWqoc1mvlQTvNnC0UdPPKwV9u3P3/k2cJhO33yYse7xeQ0bx7BVr2wJdssnrjzaUeOmLkWjfH1vkowPidhtCZB1JdW1JEg/iNh/M3C6K21oq0ojLeP3ftgAgAAAAAAAAAAAAAAAAAAAAAAAAAz/RVgAC2Eyy2yK37kAAAAAElFTkSuQmCC",
              icon: "circle",
              right: "5%",
              top: "5%",
              color: "#000"
            },
            xAxis: {
              type: "category",
              data: [0], // put the data here
              boundaryGap: false,
              axisLine: {
                lineStyle: {
                  color: "rgba(0,0,0,0.9)"
                }
              },
              axisTick: {
                inside: true,
                length: 3
              }
            },
            yAxis: {
              type: "value",
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: "rgba(0,0,0,0.9)"
                }
              },
              axisTick: {
                inside: true,
                length: 3
              }
            },
            grid: {
              containLabel: true
            },
            series: [
              {
                data: [0], // put the data here
                type: "line",
                smooth: true,
                symbol: "none",
                areaStyle: {
                  // type:'dotted',
                  color: new graphic.LinearGradient( 0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#e44f25" 
                    },
                    {
                      offset: 0.7,
                      color: "#e44f2563" 
                    }
                  ])
                }
              }
            ]
          },
          filterParams: 1,
          revenue_report: {}
        };
    },
    mounted () {
       this.renderCharts();
    },
    methods: {
        renderCharts() {
          console.log(">>>>>>>>>>>>>>renderCharts>>>>>>>>>>>>>>>>=======", this.data.campaigns.timeSeriesData);
            try {
                if(this.data.campaigns && this.data.campaigns.timeSeriesData) {
                 const chartData = this.data.campaigns.timeSeriesData

                this.lineChartOptions.xAxis.data = chartData.time;

                this.totalAmount = this.data.campaigns.totalVolume;
                this.lineChartOptions.series[0].data = chartData.amount.map(a => parseFloat(a));

                console.log("this.this.lineChartOptions=======", this.lineChartOptions);
            }
            } catch (error) {
                console.log("error1==============>>>>>>>=============",error);
            }
            
            try {
                 if(this.data.users) {
                     console.log("====this.pieChartDataOptions.series===", this.pieChartDataOptions.series);
                    const tempUserData = this.pieChartDataOptions.series[0];

                    tempUserData.data[0].value = this.data.users.verifiedCount;
                    tempUserData.data[1].value = this.data.users.unVerifiedCount;

                    this.pieChartDataOptions.series = [tempUserData];
                }
            } catch (error) {
             console.log("error2=============>>>>>>>=============",error);
            }
        },
    }
};
</script>
<style lang="scss" scoped>
.transaction-card .nav-item .nav-link.active {
    border-bottom: 1px solid #990099;
}

.pie-chart {
  min-height: 350px;
  width: 12vw;
  margin: auto;
  max-width: 600px;
}

.area-chart {
  min-height: 350px;
  margin: auto;
  max-width: 800px;
}

</style>

<template>
<div id="subnet">
    <div class="container ">
        <h1 class="">Subnet</h1>
        <p>Jump step: {{hostN}}</p>
        <p># Sunets : {{subnetN}}</p>
        <p># Subnet bits: {{subnetBitN}}</p>
        <p># Usable Host/subnet : {{hostusableN}}</p>
        <p><strong>New Mask: {{newMask}}/{{newPrefix}}</strong></p>
        <div class="containerS">
            <div class="contentS">
                <table class="table text-center">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#Subnet</th>
                            <th scope="col">Network</th>
                            <th v-if="!itsMobile()" scope="col">Usable Host Range</th>
                            <th v-if="!itsMobile()" scope="col">Broadcast</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-bind:class="{'table-secondary': bcolor(index),'text-dark': bcolor(index),last: index === (networks.length-1)}" v-for="(net,index) in netList"
                            :key="net">
                            <th scope="row">{{getIndex(index)}}</th>
                            <td>{{net}}/{{newPrefix}}</td>
                            <td v-if="!itsMobile()">{{ipToString(toDecimal(findFirst(net)),2)}} >> {{ipToString(findLast(bradcast[index]),2)}}</td>
                            <td v-if="!itsMobile()">{{bradcast[index]}}/{{newPrefix}}</td>
                        </tr>
                       
                    </tbody>
                </table>
                <infinite-loading spinner="waveDots" @infinite="infiniteHandler">
                    <span slot="no-more">Showed {{networks.length}} Networks :)</span>
                </infinite-loading>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import subnetMixin from '../mixins/subnetMixins';
import InfiniteLoading from 'vue-infinite-loading';
import PerfectScrollbar from 'perfect-scrollbar';
export default {
    components: {
        InfiniteLoading
    },
    props:{
        ip:{
            type: Object,
            required: true
        },
        host:{
            type: String
        }
    },
    data(){
        return{
           hostN: 0,
           subnetN: 0,
           subnetBitN: 0,
           hostusableN: 0,
           newMask: '',
           newPrefix: 0,
           networks:[],
           bradcast: [],
           netList: [],
           windowWidth: 0
        }
    },
    methods:{
        itsMobile: function(){
            if(this.windowWidth <= 769){
                return true;
            }else{
                return false;
            }
        },
        bcolor:function(n){
            if((n%2) !=0){
                return true;
            }
        },
        subnet: function(){
            this.hostN = 2 ** this.getHostN(this.host);
            this.subnetN = 2 ** this.getSubnetNumber(this.host,this.ip.prefix);
            this.subnetBitN = this.getSubnetNumber(this.host,this.ip.prefix);
            this.hostusableN = this.hostN - 2;
            var newInfo = this.subnetCalc(this.ip.prefix,this.subnetBitN,this.ip.ip,this.host);
            this.newPrefix = newInfo.nP;
            this.newMask = newInfo.nM;
            this.networks = newInfo.net;
            this.bradcast = newInfo.broad;
            if(this.ip.reverse==true){
                this.networks = this.networks.reverse();
                this.bradcast = this.bradcast.reverse();
            }
        },
        getIndex: function(n){
            if(this.ip.reverse){
                return this.networks.length - 1 - n;
            }else{
                return n;
            }
        },
        infiniteHandler: function($state) {
            setTimeout(() => {
                var temp = [];
                for (let i = this.netList.length; i <= this.netList.length + 10; i++) {
                    if(i<this.networks.length){
                        temp.push(this.networks[i]);
                    }
                }
                this.netList = this.netList.concat(temp);
                if(this.netList.length == this.networks.length){
                    $state.complete();
                }
                $state.loaded();
            }, 1000);
        }
    },
    mixins:[subnetMixin],
    beforeMount(){
        this.windowWidth = window.innerWidth;
    },
    mounted(){
        this.subnet();
        var ps = new PerfectScrollbar('.containerS');
        this.$nextTick(() => {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth
            });
        });
    }
}
</script>

<style scoped>
.titleRow{
    margin-top: 20px;
    margin-bottom: 0; 
}
.subetItem{
    padding: 0;
    margin: 0;
}
.last{
    margin-bottom: 20px;
}
.hidethis{
  display:none;
}
.containerS {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: auto;
  margin-bottom: 20px;
}
.containerS .contentS {
  width: 100%;
  height: 500px;
}
</style>



<template>
    <div id="vlsm">
        <h4 class="">Subnet VLSM</h4>
        <div class="containerS">
            <div class="contentS">
                <table class="table striped centered">
                    <thead>
                        <tr>
                            <th>#Subnet</th>
                            <th>#Host</th>
                            <th>Network</th>
                            <th v-if="!itsMobile()">Usable Host Range</th>
                            <th v-if="!itsMobile()">Broadcast</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(net,index) in cvlsm" :key="net">
                            <th>{{getIndex(index)}}</th>
                            <td>{{vlsm[index]}}</td>
                            <td>{{net}}/{{cvlsmp[index]}}</td>
                            <td v-if="!itsMobile()">{{ipToString(toDecimal(findFirst(net)),2)}} >> {{ipToString(findLast(cvlsmb[index]),2)}}</td>
                            <td v-if="!itsMobile()">{{cvlsmb[index]}}/{{cvlsmp[index]}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import subnetMixin from '../mixins/subnetMixins';
export default {
    props:{
        vlsm:{
            type: Array,
            required: true
        },
        ip:{
            type: Object,
            required: true
        }
    },
    data(){
        return{
            cvlsm: [],
            cvlsmb:[],
            cvlsmp:[],
            n: [],
            windowWidth: 0
        }
    },
    methods: {
        calcVlsm: function(){
            var ip = this.ip.ip;
            var prefix = this.ip.prefix;

            for(var i=0;i<this.n.length;i++){
                var networks = this.newsubNet(ip,prefix,this.n[i]);
                //console.log(networks.net)
                //console.log(networks.net[0])
                for(var j = 0; j<this.n[i+1];j++){
                    this.cvlsm.push(networks.net[j]);
                    this.cvlsmp.push(networks.pr);
                    this.cvlsmb.push(networks.br[j]);
                }
                ip = networks.net[this.n[i+1]].split('.');
                prefix = networks.pr;
                i++;
            }
        },
        newsubNet: function(sIp,sP,nH){
            var networks = [];
            var bradcast = [];
            var subnetBitN = this.getSubnetNumber(nH,sP);
            var newInfo = this.subnetCalc(sP,subnetBitN,sIp,nH);
            var prefix = newInfo.nP;
            networks = newInfo.net;
            bradcast = newInfo.broad;
            if(this.ip.reverse==true){
                networks = networks.reverse();
                bradcast = bradcast.reverse();
            }
            var ns={
                net : networks,
                br: bradcast,
                pr: prefix
            }
            return ns
        },
        countN: function(){
            var current = null;
            var cnt = 0;
            for (var i = 0; i < this.vlsm.length; i++) {
                if (this.vlsm[i] != current) {
                    if (cnt > 0) {
                        this.n.push(current)
                        this.n.push(cnt);
                    }
                    current = this.vlsm[i];
                    cnt = 1;
                } else {
                    cnt++;
                }
            }
            if (cnt > 0) {
                this.n.push(current);
                this.n.push(cnt);
            }
        },
        getIndex: function(n){
            if(this.ip.reverse){
                return this.cvlsm.length - 1 - n;
            }else{
                return n;
            }
        },
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
        }
    },
    beforeMount(){
        this.windowWidth = window.innerWidth;
    },
    mounted(){
        this.countN();
        this.calcVlsm();
        this.$nextTick(() => {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth
            });
        });
    },
    mixins:[subnetMixin]
}
</script>

<style>

</style>

<template>
<div id="subnet">
    <div class="container ">
        <h1 class="">Subnet</h1>
        <p>Jump step: {{hostN}}</p>
        <p># Sunets : {{subnetN}}</p>
        <p># Subnet bits: {{subnetBitN}}</p>
        <p># Usable Host/subnet : {{HostusableN}}</p>
        <p>
            <strong>New Mask: {{newMask}}/{{newPrefix}}</strong>
        </p>

 
            <table class="table text-center">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#Subnet</th>
                        <th scope="col">Network</th>
                        <th scope="col">Usable Host Range</th>
                        <th scope="col">Broadcast</th>
                    </tr>
                </thead>
                <tbody class="text-center">
                    <tr v-for="(net,index) in netList" :key="index">
                        <tr v-bind:class="{'table-secondary': bcolor(index),'text-dark': bcolor(index),last: index === (networks.length-1)}" v-for="(net,index) in netList"
                            :key="net">
                            <th scope="row">{{index}}</th>
                            <td>{{net}}/{{newPrefix}}</td>
                            <td>{{ipToString(toDecimal(findFirst(net)),2)}} >> {{ipToString(findLast(bradcast[index]),2)}}</td>
                            <td>{{bradcast[index]}}/{{newPrefix}}</td>
                        </tr>
                </tbody>

            </table>
   
        <infinite-loading spinner="waveDots" @infinite="infiniteHandler">
            <span slot="no-more">
                Showed {{networks.length}} Networks :)
            </span>
        </infinite-loading>
    </div>
</div>
</template>

<script>
import subnetMixin from '../mixins/subnetMixins';
import InfiniteLoading from 'vue-infinite-loading';
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
           HostusableN: 0,
           newMask: '',
           newPrefix: 0,
           networks:[],
           bradcast: [],
           netList: []
        }
    },
    methods:{
        itsMobile: function(){

        },
        bcolor:function(n){
            if((n%2) !=0){
                return true;
            }
        },
        getHostN:function(host){
            var n = 0;
            var temp = 0;
            while((temp-host)<2){
                n++;
                temp = 2**n;
            }
            return n;
        },
        getSubnetNumber: function(){
           return 32 - this.getHostN(this.host) - Number(this.ip.prefix);
        },
        subnet: function(){
            this.hostN = 2 ** this.getHostN(this.host);
            this.subnetN = 2 ** this.getSubnetNumber();
            this.subnetBitN = this.getSubnetNumber();
            this.HostusableN = this.hostN - 2;
            this.subnetCalc();
        },
        subnetCalc: function(){
            this.newPrefix = Number(this.ip.prefix) + this.subnetBitN;
            this.newMask = this.getMask(this.newPrefix);
            var s = this.ipToString(this.toBinary(this.ip.ip));
            var r = this.combinations(this.subnetBitN);
            var p1 = s.substring(0,Number(this.ip.prefix));
            var p2 = s.substring(s.length - this.getHostN(this.host),s.length);
            r.forEach(element => {
                var t = (p1 + element + p2).split('');
                var t2 = ''
                for(var i=0;i<t.length;i++){
                    if(i==8||i==16||i==24){
                        t2 += '.';
                    }
                    t2 += t[i];
                }
                this.networks.push(this.ipToString(this.toDecimal(t2.split('.')),2));
                this.bradcast.push(this.ipToString(this.broadcasteCalc(this.toDecimal(t2.split('.'))),2));
            });
            
        },
        broadcasteCalc: function(subIp){
            var binMaskinverted = this.invertSubmask(this.toBinary(this.getMask(this.newPrefix).split('.')));
            var plainIp = this.ipToString(this.toBinary(subIp),3).split('');
            var plainIpMaskI = this.ipToString(binMaskinverted,3).split('');
            var s = ''
            for(var i=0;i<plainIp.length;i++){
                if(i == 8 || i==16 || i==24){
                    s+='.'
                }
                if(plainIp[i] ==1 || plainIpMaskI[i] == 1){
                    s+='1';
                }else{
                    s+='0';
                }
            }
            return this.toDecimal(s.split('.'));
        },
        findFirst: function(subIp){
            var t = this.toBinary(subIp.split('.'));
            var t2 = t[t.length-1].split('')
            t2[t2.length-1] = '1';
            t2 = t2.join('');
            t[t.length-1] = t2;
            return(t);
        },
        findLast:function(subIp){
            var t = subIp.split('.');
            t[t.length-1] = t[t.length-1]-1;
            return t;
        },
        getIndex: function(n){
            var t = this.networks.length;
            if((t-n)>10){
                return 10;
            }else{
                return t-n;
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
    mounted(){
        this.subnet();
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
</style>



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
        <div class="table-resposive">
            <table class="table text-center">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col-sm-1">#Subnet</th>
                        <th scope="col-sm-11">Network</th>
                        <th scope="col hidden-md-down">Usable Host Range</th>
                        <th scope="col hidden-md-down">Broadcast</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-bind:class="{'table-secondary': bcolor(index),'text-dark': bcolor(index),last: index === (networks.length-1)}"  v-for="(net,index) in networks" :key="net">
                        <th scope="row">{{index}}</th>
                        <td>{{net}}/{{newPrefix}}</td>
                        <td class="hidden-md-down">{{ipToString(toDecimal(findFirst(net)),2)}}  >> {{ipToString(findLast(bradcast[index]),2)}}</td>
                        <td class="hidden-md-down">{{bradcast[index]}}/{{newPrefix}}</td>
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
           bradcast: []
        }
    },
    methods:{
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
            s = Array.from(s)
            var r = this.combinations(this.subnetBitN);
            r.forEach(element => {
                var s2 = '';
                for(var i =0; i<s.length;i++){
                    if(i==8 || i==16 || i==24){
                        s2 += '.'
                    }
                    if(i == Number(this.ip.prefix)){
                        s2 += element;
                        i = this.newPrefix-1;
                    }else{
                        s2 += s[i]; 
                    }
                }
                this.networks.push(this.ipToString(this.toDecimal(s2.split('.')),2));
                this.bradcast.push(this.ipToString(this.broadcasteCalc(this.toDecimal(s2.split('.'))),2));
            });
            this.findFirst(this.networks[0])
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
</style>



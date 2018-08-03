<template>
<div id="main" class="container">
    <vlist-app v-on:updateVLSM="updateVLSM($event)"></vlist-app>
    <h1>Subnet Calculator</h1>
    <div class="row">
        <div class="col-sm-12 col-md-6">
            <input v-model.lazy='ip.dec' required class="form-control" type="tel" placeholder="Ip Address/Prefix">
            <input required v-model.lazy='host'  class="form-control" type="tel" placeholder="Host Number">
            <div class="form-check position-static">
              <input class=" form-check-input position-static" type="checkbox" id="reverse" value="Invert Order" v-model.lazy="ip.reverse" v-bind:disabled="!isReverse">
              <label class="form-check-label position-static" for="reverse">  Invert Order</label>
            </div>            
            <button v-if="!showButton" @click="subnetp" type="button" class="btn btn-dark">Subnet</button>
            <button v-if="showButton" @click="buttonSitch" type="button" class="btn btn-dark">Re subnet</button>
            <button v-if="!showButton" @click="viewList" type="button" class="btn btn-primary">VLSM</button>
        </div>
        <div id="ipInfo" class="col-sm-12 col-md-6">
            <h3>Network Info</h3>
            <h5>Network</h5>
            <p>Decimal: {{ip.dec}}</p>
            <p>Binary: {{binaryIP}}</p>
            <h5>NetMask</h5>
            <p>Decimal: {{maskIP}}</p>
            <p>Binary: {{toBinaryMask}}</p>
        </div>
    </div>
    <subnet-app v-if="showSubnet" v-bind:host="host" v-bind:ip='ip'></subnet-app>
    <vlsm-app v-if="showVlsm" v-bind:vlsm="vlsm,ip"></vlsm-app>
</div>
</template>

<script>
  import Subnet from './Subnet.vue'
  import Vlsm from './Vlsm.vue'
  import vlsmList from './vlsmList.vue'
  import subetMixins from'../mixins/subnetMixins'
  export default {
    components:{
      'subnet-app': Subnet,
      'vlsm-app': Vlsm,
      'vlist-app': vlsmList
    },
    head: {
      meta:[{
       
      }]
    },
    data(){
      return{
        ip:{
          dec:'',
          prefix:'',
          ip:[],
          reverse:false
        },
        host: '',
        showSubnet: false,
        showVlsm: false,
        isReverse: true,
        showButton: false,
        vlsm:[]
      }
    },
    methods:{
      buttonSitch: function(){
        if(this.showSubnet){
           this.showSubnet = !this.showSubnet;
        }
        if(this.showVlsm){
         this.showVlsm = !this.showVlsm;
        }
        this.showButton = !this.showButton;
      },
      itsIp: function(ipaddress){
        ipaddress = ipaddress.split('/');
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress[0])) {  
          return (true);
        }   
        return (false);
      },
      itsPrefix: function(prefix){
          prefix = prefix.split('/');
          if(Number(prefix[1])>=8 && Number(prefix[1])<=32){
            return (true);
          }
          return (false);
      },
      subnetp: function(){
          if(this.itsIp(this.ip.dec) && this.itsPrefix(this.ip.dec) && !isNaN(this.host) && Number(this.host)){
            this.showSubnet = !this.showSubnet;
            this.isReverse = !this.isReverse;
            this.showButton = !this.showButton;
          }
      },
      separete: function(){
        var sip = this.ip.dec.split('/');
        this.ip.prefix = sip.pop();
        this.ip.ip = sip[0].split('.');
      },
      viewList: function(){
        if(this.itsIp(this.ip.dec) && this.itsPrefix(this.ip.dec)){
          this.$modal.show('list');
          this.showButton = !this.showButton;
        }
      },
      updateVLSM: function(event){
        this.vlsm = event;
        this.showVlsm = true;
        this.isReverse = !this.isReverse;
      }
    },
    computed:{
      binaryIP:function(){
        if(this.ip.dec != ''){
          this.separete();
          return this.ipToString(this.toBinary(this.ip.ip,true),1);
        }else{
          return ''
        }
      },
      maskIP:function(){
        if(this.ip.dec != ''){
          this.separete();
          return this.getMask(Number(this.ip.prefix)) + '/' + this.ip.prefix;
        }else{
          return ''
        }
      },
      toBinaryMask: function(){
        if(this.ip.dec != ''){
          this.separete();
          var a = this.getMask(Number(this.ip.prefix));
          a = a.split('.');
          return this.ipToString(this.toBinary(a,true),1);
        }else{
          return ''
        }
      }
    },
    mixins: [subetMixins]
  }
</script>

<style scoped>
#main{
  margin-top: 10px;
  padding-top: 20px;
}
input,button{
    margin-top: 15px;
}
button{
    margin-left: 10px; 
}
#ipInfo{
  background: #eee;
  padding: 20px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}
#ipInfo > p{
  padding: 0;
  margin: 0;
}
@media only screen and (max-width: 767px) {
  #ipInfo{
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
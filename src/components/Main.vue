<template>
<div id="main" class="container">
  <h1>Subnet Calculator</h1>
  <vlist-app v-on:updateVLSM="updateVLSM($event)"></vlist-app>
  <div class="row">
    <div class="col s12 m6 offset-m3">
      <div class="input-field col s12">
        <input v-model.lazy='ip.dec' required type="tel" placeholder="192.168.10.0/24" id="ipAddress" class="validate center-align">
        <label for="ipAddress">Ip Address</label>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="switch col s12 m6">
      <label>
        <input id="reverse" value="Invert Order" v-model.lazy="ip.reverse" v-bind:disabled="!isReverse" type="checkbox">
        <span class="lever"></span>
        Reverse order when subneting/VLSM
      </label>
    </div>
    <div class="col s12 m6">
      <a id="resub" v-if="showButton" @click="buttonSitch" class=" col s12 blue darken-3 waves-effect waves-dark btn">Re subnet/VLSM</a>
    </div>
  </div>

  <div class="row">
    <div class="col s12">
      <ul class="tabs blue-text">
        <li class="tab col s4">
          <a href="#subnet">Subnet</a>
        </li>
        <li class="tab col s4">
          <a class="active" href="#ipinfo">Ip info</a>
        </li>

        <li class="tab col s4">
          <a href="#vlsm">VLSM</a>
        </li>
      </ul>
    </div>

    <div id="ipinfo" class="col s12">
      <a id="info"@click="getInfo" class=" col s12 blue darken-3 waves-effect waves-dark btn">Ip Info</a>
      <table v-if="showInfo">
        <thead>
          <tr>
            <th>Source Ip</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Binary: </td>
            <td>{{this.ipToString(this.toBinary(ip.ip),1)}}</td>
          </tr>
        </tbody>
       
        <thead>
          <tr>
            <th>Network</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Decimal: </td>
            <td>{{this.getNetwork(this.ip.ip,Number(this.ip.prefix))}}/{{this.ip.prefix}}</td>
          </tr>
          <tr>
            <td>Binary:</td>
            <td>{{this.ipToString(this.toBinary(this.getNetwork(this.ip.ip,Number(this.ip.prefix)).split('.')),3)}}</td>
          </tr>
        </tbody>

        <thead>
          <tr>
            <th>Netmask</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Decimal: </td>
            <td>{{this.getMask(Number(ip.prefix))}}</td>
          </tr>
          <tr>
            <td>Binary:</td>
            <td>{{this.ipToString(this.toBinary(this.getMask(Number(ip.prefix)).split('.')),2)}}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Broadcast</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Decimal: </td>
            <td>{{this.ipToString(this.broadcasteCalc(this.getNetwork(this.ip.ip,Number(this.ip.prefix)).split('.'),Number(ip.prefix)),2)}}</td>
          </tr>
          <tr>
            <td>Binary:</td>
            <td>{{this.ipToString(this.toBinary(this.getMask(Number(ip.prefix)).split('.')),2)}}</td>
          </tr>
        </tbody>
         <thead>
          <tr>
            <th>Host Usable Range</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> </td>
            <td>{{this.ipToString(this.toDecimal(this.findFirst(this.getNetwork(this.ip.ip,Number(this.ip.prefix)))),2)}}  >> {{usableRange}}</td>
          </tr>
            
        </tbody>
      </table>
    </div>

    <div id="subnet" class="col s12">
      <div class="row">
        <div class="input-field col s12 m6">
          <input required v-model.lazy='host' type="tel" placeholder="5000" id="ipAddress" class="validate center-align">
          <label for="ipAddress">Host Number</label>
        </div>
        <div class="subnetButton input-field col s12 m6">
          <a v-if="!showButton" @click="subnetp"  class=" col s12 blue darken-3 waves-effect waves-dark btn">Subnet</a>
        </div>
      </div>
      <div class="row">
        <div class="col s12">
          <subnet-app v-if="showSubnet" v-bind:host="host" v-bind:ip='ip'></subnet-app>
        </div>
      </div>
    </div>

    <div id="vlsm" class="col s12">
      <div class="subnetButton input-field col s12 m6 offset-m3">
        <a v-if="!showButton" @click="viewList" class=" col s12 blue darken-3 waves-effect waves-dark btn">VLSM List</a>
      </div>
      <vlsm-app v-if="showVlsm" v-bind:vlsm="vlsm,ip"></vlsm-app>
    </div>
  </div>
</div>
</template>

<script>
  import Subnet from './Subnet.vue'
  import Vlsm from './Vlsm.vue'
  import vlsmList from './vlsmList.vue'
  import subetMixins from'../mixins/subnetMixins'
  import jQuery from 'jquery'
  global.jQuery = jQuery
  global.$ = jQuery
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
        ipSource:{
          bin: '',
          net: '',

        },
        host: '',
        showSubnet: false,
        showVlsm: false,
        isReverse: true,
        showButton: false,
        showInfo: false,
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
        this.isReverse = true;
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
            if(this.itsInMask(this.ip.ip,Number(this.ip.prefix))){
              this.showSubnet = !this.showSubnet;
              this.isReverse = !this.isReverse;
              this.showButton = !this.showButton;
            }
          }
      },
      separete: function(){
        var sip = this.ip.dec.split('/');
        this.ip.prefix = sip.pop();
        this.ip.ip = sip[0].split('.');
      },
      viewList: function(){
        if(this.itsIp(this.ip.dec) && this.itsPrefix(this.ip.dec) && this.itsInMask(this.ip.ip,Number(this.ip.prefix))){
          this.$modal.show('list');
          this.showButton = !this.showButton;
        }
      },
      updateVLSM: function(event){
        this.vlsm = event;
        this.showVlsm = true;
        this.isReverse = !this.isReverse;
      },
      itsInMask: function(ip,prefix){
        var s = this.ipToString(this.toBinary(ip),3).split('');
        var s2 = this.ipToString(this.toBinary(this.getMask(prefix).split('.')),3).split('');
        var s3 = '';
        for(var i = 0;i<s.length;i++){
          if(s[i] == 1 &&  s2[i]==1){
            s3 += s[i];
          }else{
            s3 += '0'
          }
        }
        if(s3 == s.join('')){
          return true;
        }else{
          return false;
        }
      },
      getInfo: function(){
        if(this.ip.dec != ''){
          this.separete();
          if(this.itsInMask(this.ip.ip,Number(this.ip.prefix))){
            this.showInfo = true;
          }
        }else{
          this.showInfo = false;
          return ''
        }
      }
    },
    computed:{
      usableRange:function(){
        return this.ipToString(this.findLast(this.ipToString(this.broadcasteCalc(this.getNetwork(this.ip.ip,Number(this.ip.prefix)).split('.'),Number(this.ip.prefix)),2)),2)
      }
    },
    mixins: [subetMixins],
    mounted(){
      this.$nextTick(() => {
        jQuery('.tabs').tabs();
        jQuery(".tabs>.indicator").css("background-color", '#1e88e5');
      });
    }
  }
</script>

<style scoped>
#subnet,
#ipinfo,
#vlsm {
  margin-top: 30px;
}

.subnetButton {
  top: 10px;
}
/* label color */
.input-field label {
  color: #000 !important;
}
/* label focus color */
.input-field input[type=text]:focus+label {
  color: #2196f3 !important;
}
/* label underline focus color */
.input-field input[type=text]:focus {
  border-bottom: 1px solid #2196f3 !important;
  box-shadow: 0 1px 0 0 #2196f3 !important;
}

.tabs .tab a {
  color: #1e88e5 !important;
}
.tabs .tab a:hover,
.tabs .tab a.active {
  background-color: transparent !important;
  color: #1976d2 !important;
}
.tabs .indicator {
  background-color: #1e88e5 !important;
}
.tabs .tab.disabled a,.tabs .tab.disabled a:hover {
	color: #1976d2 !important;	
}

@media only screen and (max-width: 767px) {
  .subnetButton {
    top: 0px;
  }
  #resub{
    margin-top: 20px;
  }
}
</style>
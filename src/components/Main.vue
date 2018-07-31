<template>
<div id="main" class="container">
    <h1>Subnet Calculator</h1>
    <div class="row">
        <div class="col-sm-12 col-md-6">
            <input v-model.lazy='ip.dec' required class="form-control" type="text" placeholder="Ip Address/Prefix">
            <input required v-model.lazy='host'  class="form-control" type="text" placeholder="Host Number">
            <button  v-bind:class="{disabled: showSubnet}" @click="subnetp" type="button" class="btn btn-dark">Subnet</button>
            <button v-bind:class="{disabled: !showSubnet}" @click="clear" type="button" class="btn btn-dark">Clear</button>
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
    <subnet-app v-if="showSubnet" v-bind:ip='ip,host'></subnet-app>
</div>
</template>

<script>
  import Subnet from './Subnet.vue'
  import subetMixins from'../mixins/subnetMixins'
  export default {
    components:{
      'subnet-app': Subnet
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
          ip:[]
        },
        host: '',
        showSubnet: false
      }
    },
    methods:{
      subnetp: function(){
        this.showSubnet = true;
        this.separete();
      },
      clear: function(){
        this.showSubnet = false;
        this.ip.dec = '';
        this.host = '';
      },
      separete: function(){
        var sip = this.ip.dec.split('/');
        this.ip.prefix = sip.pop();
        this.ip.ip = sip[0].split('.');
      },
      
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
@media only screen and (max-width: 600px) {
  #ipInfo{
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
</style>
<template>
<modal @before-close="beforeClose" name="list" transition="pop-out" :width="modalWidth" :height="400">
    <div id="list">
        <div class="containerS">
            <div class="contentS">
                <table class="table striped centered">
                    <thead>
                        <tr>
                            <th>#Subnet</th>
                            <th>Network</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(input, index) in inputs" :key="index">
                            <td>#{{index}}</td>
                            <td><input :ref="'vlist'" v-on:keyup.enter="addRow" v-model="inputs[index]"  type="tel" placeholder="Numer of host"></td>
                            <td><a class="blue darken-3 waves-effect waves-dark btn" @click="deleteRow(index)">-</a></td>
                        </tr>
                       
                    </tbody>
                </table>
                    <div class="row">
                    <a id="add" @click="addRow" class="col s2 offset-s1 blue darken-3 waves-effect waves-dark btn">+</a>
                    <a id="ok" @click="orderList" class="col s7 offset-s1 blue darken-3 waves-effect waves-dark btn">OK</a> 
                </div>
            </div>
        </div>
    </div>
</modal>
</template>
<script>
//import PerfectScrollbar from 'perfect-scrollbar';
const MODAL_WIDTH = 656
export default {
    data(){
        return{
            modalWidth: MODAL_WIDTH,
            inputs: []
        }
    },
    methods:{
        addRow() {
            this.inputs.push('');
            this.$nextTick(() => {
                let index = this.inputs.length-1;
                let input = this.$refs.vlist[index];
                input.focus();
            });
        },
        deleteRow(index) {
            this.inputs.splice(index,1)
        },
        orderList(){
            var t = [];
            this.inputs.forEach(element => {
                if(!isNaN(element) && element!='' && element!=' '){
                    t.push(element);
                }
            });
            t = t.sort(function(a,b){return a-b});
            this.inputs = t.reverse();
            this.$emit('updateVLSM',this.inputs);
            this.$modal.hide('list');
        },
        beforeClose(){
            this.inputs = [];
            this.inputs.push('')
        }
    },
    created(){
        this.modalWidth = window.innerWidth < MODAL_WIDTH
      ? MODAL_WIDTH / 2
      : MODAL_WIDTH
    },
    mounted(){
        this.inputs.push('')
        //var ps = new PerfectScrollbar('.containerS');
    }

}
</script>

<style scoped>
.containerS {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: auto;
  margin-bottom: 20px;
}
.containerS .contentS {
  width: 100%;
  height: 400px;
}
td{
    padding: 0;
}
#add{
    margin-top:10px;
    margin-bottom: 5px;
}
#ok{
    margin-top:10px; 
}
</style>

<template>
<modal @before-close="beforeClose" name="list" transition="pop-out" :width="modalWidth" :height="400">
    <div id="list">
        <div class="containerS">
            <div class="contentS">
                <table class="table text-center">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#Subnet</th>
                            <th scope="col">Network</th>
                            <th scope="col"> </th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-for="(input, index) in inputs" :key="index">
                            <th scope="row">#{{index}}</th>
                            <td><input :ref="'vlist'" v-on:keyup.enter="addRow" v-model="inputs[index]" class="form-control" type="tel" placeholder="Numer of host"></td>
                            <td><button class="btn" @click="deleteRow(index)">-</button></td>
                        </tr>
                       <div class="container">
                           <button @click="addRow" class="btn">+</button>
                       </div>
                    </tbody>
                </table>
                <div class="container">
                    <button  @click="orderList" class="btn btn-primary btn-block">OK</button>
                </div>
            </div>
        </div>
    </div>
</modal>
</template>
<script>
import PerfectScrollbar from 'perfect-scrollbar';
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
#list{
    background: #fff;
    margin: 0 auto;
}
</style>

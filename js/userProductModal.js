export default {
  template: '#userProductModal',
  props: {
    product: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      status: {},
      modal: '',
      qty: 1,
    };
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    hideModal() {
      this.qty = 1;
      this.modal.hide();  
    },
  },
  watch: {
    qty() { 
      if(this.qty < 0 || this.qty === 0 ) {
        alert('數量不能低於1');
        this.qty = 1;
      }
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal, {
      keyboard: false,
      backdrop: 'static'
    });
  },
}
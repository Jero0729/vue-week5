import userProductModal from './userProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true  
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'mmee1122';

const app =Vue.createApp({
  data(){
    return{
      loadingStatus: {
        loadingItem: ''           
      },      
      isLoading:false,
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    }
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods:{
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products`)
            .then(res=>{
              this.products=res.data.products;
            }).catch(err=>{
              alert(err.data.message)
            })
    },
    getProduct(id){
      this.loadingStatus.loadingItem = id;
      axios.get(`${apiUrl}/api/${apiPath}/product/${id}`).then( response => {
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        this.$refs.userProductModal.openModal();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    getCart(){
      axios.get(`${apiUrl}/api/${apiPath}/cart`).then((response) => {
        this.cart = response.data.data;
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    addToCart(product_id,qty=1){ 
      this.loadingStatus.loadingItem = product_id;
      const cart ={
        product_id,
        qty
      };
      axios.post(`${apiUrl}/api/${apiPath}/cart`,{data:cart})
      .then(res=>{
        alert(res.data.message);
        this.loadingStatus.loadingItem = '';
        this.$refs.userProductModal.hideModal();
        this.getCart();
      }).catch(err=>{
        alert(err.data.message)
      })
      
    },
    deleteAllCarts(){
      axios.delete(`${apiUrl}/api/${apiPath}/carts`).then((res) => {
        alert(res.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    deleteOneCart(id){
      this.loadingStatus.loadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    update(data){
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(`${apiUrl}/api/${apiPath}/cart/${data.id}`, { data: cart }).then(res => {
        alert(res.data.message);
        this.loadingStatus.loadingItem = '';
        this.getCart();
      }).catch(err => {
        alert(err.data.message);
        this.loadingStatus.loadingItem = '';
      });
    },
    createOrder(){
      const order = this.form;
      axios.post(`${apiUrl}/api/${apiPath}/order`, { data: order }).then(res => {
        alert(res.data.message);
        console.log(this.$refs.form)
        this.$refs.form.resetForm();
        this.form.message = '';
        
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    loading(){
      this.isLoading=true ;
      setTimeout(() => {
        this.isLoading=false;
      }, 1000);
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的行動電話'
    }
  },
  watch:{
    "cart.carts":{
      handler(n) {
        n.forEach((item)=>{
          if(item.qty<0 || item.qty ===0 ){
            alert('數量不能低於1');
            item.qty = 1;
          }
        })
      },
      deep: true
    }
  },
  mounted(){
    this.getProducts();
    this.getCart();
    this.loading()
  }
})
app.component('userProductModal',userProductModal)
app.component('VLoading', VueLoading.Component)
app.mount("#app")